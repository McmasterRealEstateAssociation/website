// Flips the switches in content/site.ts, rebuilds, and checks what the site renders.
// content/site.ts is always restored from git at the end, so commit your changes first.
// Usage: node scripts/qa/switch-tests.mjs   (needs port 3100 free; takes a few minutes)
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "playwright";

const SITE = "content/site.ts";
const BASE = "http://localhost:3100";
const original = fs.readFileSync(SITE, "utf8");
const eol = original.includes("\r\n") ? "\r\n" : "\n";
const normalized = original.replace(/\r\n/g, "\n");
let failures = 0;
let server;

const check = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failures++;
};

/** Applies [from, to] replacements to the original content file (each must match). */
function setContent(edits) {
  let s = normalized;
  for (const [from, to] of edits) {
    if (!s.includes(from)) throw new Error(`Switch test edit didn't match: ${from}`);
    s = s.replace(from, to);
  }
  fs.writeFileSync(SITE, s.replace(/\n/g, eol));
}

/** Stops the server and its child processes (a plain kill leaves them running on Windows). */
function stopServer() {
  if (!server) return;
  try {
    execSync(process.platform === "win32" ? `taskkill /pid ${server.pid} /T /F` : `kill ${server.pid}`, { stdio: "ignore" });
  } catch {}
  server = undefined;
}

async function buildAndServe() {
  if (server) {
    stopServer();
    await new Promise((r) => setTimeout(r, 1500));
  }
  execSync("npx next build", { stdio: "pipe", shell: true });
  server = spawn("npx next start -p 3100", { shell: true, stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Server did not start");
}

const get = async (path) => {
  const res = await fetch(BASE + path);
  const text = await res.text();
  // `html` is the rendered markup without scripts (React's data payload lists every variant).
  const html = text.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
  return { status: res.status, type: res.headers.get("content-type") ?? "", text, html };
};

const LEO_ANNOUNCED = [
  ['    status: "draft",\n    title: "Six Figures', '    status: "announced",\n    title: "Six Figures'],
  ['location: { room: "", building: "McMaster University" },\n    rsvpUrl: "",\n    speakers: [\n      {\n        name: "Leo Puskar"',
    'location: { room: "TEST ROOM 101", building: "McMaster University" },\n    rsvpUrl: "https://www.eventbrite.ca/e/test-123",\n    speakers: [\n      {\n        name: "Leo Puskar"'],
];
const HEADSHOTS = [["    filmed: true,\n    headshotsConfirmed: false,", "    filmed: true,\n    headshotsConfirmed: true,"]];
const RECRUITING_CLOSED = [['status: "opening-soon",\n  season', 'status: "closed",\n  season']];
const RECRUITING_OPEN = [
  ['status: "opening-soon",\n  season', 'status: "open",\n  season'],
  ['closesOn: "2026-10-25",\n  applyUrl: "",', 'closesOn: "2026-10-25",\n  applyUrl: "https://forms.office.com/test-apply",'],
];
const LEO_ENDED = [
  ['doorsOpen: "2026-10-07T17:30:00-04:00",\n    start: "2026-10-07T18:00:00-04:00",\n    end: "2026-10-07T19:45:00-04:00",',
    'doorsOpen: "2026-09-02T17:30:00-04:00",\n    start: "2026-09-02T18:00:00-04:00",\n    end: "2026-09-02T19:45:00-04:00",'],
];

const LEO = "/events/2026-10-leo-puskar";
try {
  // 1. Announced event, headshots not confirmed, recruiting closed.
  setContent([...LEO_ANNOUNCED, ...RECRUITING_CLOSED]);
  await buildAndServe();
  let home = await get("/");
  let page = await get(LEO);
  check(page.status === 200, "announced event page exists");
  check(home.text.includes("Six Figures in Your Early 20s") && home.text.includes("Get your free ticket"), "home shows the next event and the ticket button");
  check(page.text.includes('href="https://www.eventbrite.ca/e/test-123"'), "event page has the RSVP link");
  check(page.text.includes('"@type":"Event"') && page.text.includes('"priceCurrency":"CAD"'), "event page has Event JSON-LD with a free CAD offer");
  check(!/headshot/i.test(page.text), "no headshot text while headshots are unconfirmed");
  check(page.text.includes("filmed for MREA&#x27;s and Leo&#x27;s social channels") || page.text.includes("filmed for MREA's and Leo's social channels"), "filming notice names Leo");
  check(page.text.includes("calendar.google.com/calendar/render") && page.text.includes(`${LEO}/calendar.ics`), "calendar links shown");
  const ics = await get(`${LEO}/calendar.ics`);
  check(ics.status === 200 && ics.type.includes("text/calendar") && ics.text.includes("DTSTART:20261007T213000Z") && ics.text.includes("DTEND:20261007T234500Z"), ".ics file: 5:30-7:45 PM Toronto as UTC");
  check((await get("/sitemap.xml")).text.includes(LEO), "sitemap lists the announced event");
  check((await get("/links")).text.includes("Next event: Six Figures in Your Early 20s, Oct 7"), "links page shows the next event");
  check(page.text.includes("TEST ROOM 101, McMaster University"), "spec sheet shows the room");
  let team = await get("/team");
  check(team.text.includes("Recruiting is closed for now"), "recruiting closed: team page says so");
  check(!(await get("/links")).html.includes("Team applications") && !/We(&#x27;|')re recruiting/.test(home.html), "recruiting closed: no recruiting on home or links");

  // 1b. In the browser, once the event has ended: RSVP hidden and home says "announced soon".
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const tab = await ctx.newPage();
  await tab.clock.install({ time: new Date("2026-10-08T12:00:00-04:00") });
  await tab.goto(BASE + LEO, { waitUntil: "networkidle" });
  check((await tab.locator('a[href="https://www.eventbrite.ca/e/test-123"]').count()) === 0, "client: RSVP hidden after the event ends (no rebuild)");
  check(await tab.getByText("This event has ended").isVisible(), "client: ended note shown");
  await tab.goto(BASE + "/", { waitUntil: "networkidle" });
  check(await tab.getByText("Next event announced soon").isVisible(), "client: home switches to 'announced soon'");
  check((await tab.getByRole("link", { name: "Get your free ticket" }).count()) === 0, "client: home ticket button hidden after the event");
  const before = await ctx.newPage();
  await before.clock.install({ time: new Date("2026-10-01T12:00:00-04:00") });
  await before.goto(BASE + LEO, { waitUntil: "networkidle" });
  check((await before.locator('a[href="https://www.eventbrite.ca/e/test-123"]').count()) === 1, "client: RSVP visible before the event");
  await browser.close();

  // 2. Headshots confirmed, recruiting open.
  setContent([...LEO_ANNOUNCED, ...HEADSHOTS, ...RECRUITING_OPEN]);
  await buildAndServe();
  page = await get(LEO);
  check(page.text.includes("Free professional LinkedIn headshots from Leo") && page.text.includes("Doors, pizza and headshots"), "headshots confirmed: highlight and agenda mention them");
  team = await get("/team");
  check(team.text.includes('href="https://forms.office.com/test-apply"') && team.text.includes("Apply now"), "recruiting open: Apply now button");
  check((await get("/links")).text.includes("Apply to join the team"), "recruiting open: links page button");

  // 3. Event already over at build time; recruiting opening soon (the defaults).
  setContent([...LEO_ANNOUNCED, ...LEO_ENDED]);
  await buildAndServe();
  page = await get(LEO);
  home = await get("/");
  check(page.status === 200 && !page.text.includes('href="https://www.eventbrite.ca/e/test-123"'), "ended event: page has no RSVP");
  check(!home.text.includes("Get your free ticket") && home.text.includes("Next event announced soon"), "ended event: home shows 'announced soon'");
  check((await get(`${LEO}/calendar.ics`)).status === 404, "ended event: no .ics file");
  team = await get("/team");
  check(team.html.includes("Applications open October 7 and close October 25.") && !team.html.includes("Apply now"), "recruiting opening soon: dates, no Apply button");
  check((await get("/links")).text.includes("Team applications open October 7"), "recruiting opening soon: links page line");
  check(home.html.includes("We&#x27;re recruiting") || home.html.includes("We're recruiting"), "recruiting opening soon: home badge");

  // 4. Back to the real content: the draft event is nowhere.
  fs.writeFileSync(SITE, original);
  await buildAndServe();
  check((await get(LEO)).status === 404, "draft event: page is a 404");
  check(!(await get("/sitemap.xml")).text.includes("leo"), "draft event: not in the sitemap");
  check(!(await get("/links")).text.includes("Six Figures") && !(await get("/")).text.includes("Six Figures"), "draft event: not on home or links");
} finally {
  fs.writeFileSync(SITE, original);
  execSync(`git checkout -- ${SITE}`, { stdio: "ignore" });
  stopServer();
}
console.log(failures ? `\n${failures} check(s) failed` : "\nAll switch tests passed");
process.exit(failures ? 1 : 0);
