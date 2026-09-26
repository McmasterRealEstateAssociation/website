// Renders on-brand event graphics from content/site.ts:
//   - Instagram carousel slides (1080 x 1350) from the event's promo.carousel
//   - an Instagram story (1080 x 1920)
//   - an Eventbrite banner (2160 x 1080)
//   - a LinkedIn post image (1200 x 627)
//
// Usage:
//   npm run graphics                      every upcoming (draft or announced) event
//   npm run graphics -- 2026-10-leo-puskar
//   npm run graphics -- 2026-10-leo-puskar --out "D:\somewhere"
//
// Output: ../brand-kit/events/<event-slug>/ (next to this repo, i.e. C:\MREA\brand-kit).
// Draft events go into a preview\ subfolder so nobody posts them by mistake.
import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { carouselSlide, story, wideBanner } from "./templates.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
const outRoot = outFlag >= 0 ? path.resolve(args[outFlag + 1]) : path.resolve(repo, "..", "brand-kit", "events");
const only = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");

// 1. Bundle the TypeScript content (and its photo imports) into something Node can load.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mrea-graphics-"));
await build({
  stdin: {
    contents: `export * from "./content/site"; export * from "./lib/events"; export * from "./lib/dates";
      export { MARK_PATH, BUILDING_PARTS } from "./components/brand/mark-paths";`,
    resolveDir: repo,
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: path.join(tmp, "content.mjs"),
  loader: { ".jpg": "file", ".jpeg": "file", ".png": "file" },
  assetNames: "[name]-[hash]",
  tsconfig: path.join(repo, "tsconfig.json"),
  logLevel: "error",
});
const c = await import(pathToFileURL(path.join(tmp, "content.mjs")).href);

// 2. Shared assets: fonts and photos as data URIs, so each page is self-contained.
const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString("base64")}`;
const fontDir = path.join(repo, "assets", "fonts");
const fonts = {
  cinzel: dataUri(path.join(fontDir, "Cinzel-600.ttf"), "font/ttf"),
  montserrat500: dataUri(path.join(fontDir, "Montserrat-500.ttf"), "font/ttf"),
  montserrat600: dataUri(path.join(fontDir, "Montserrat-600.ttf"), "font/ttf"),
};
const photoUri = (photo) => {
  if (!photo) return undefined;
  const src = typeof photo.src === "string" ? photo.src : photo.src?.src;
  return src ? dataUri(path.resolve(tmp, src), "image/jpeg") : undefined;
};

// 3. Build the data each template needs.
function model(event) {
  const roomOrTba = event.location.room || c.copy.event.roomTba;
  const withHeadshots = (items) =>
    items.filter((i) => !i.onlyWithHeadshots || event.headshotsConfirmed).map((i) => i.text);
  const doors = c.doorsTime(event);
  const start = c.startTime(event);
  const dateNoYear = event.start ? c.formatLongDateNoYear(event.start) : c.eventDateLong(event);
  const speaker = event.speakers[0];
  return {
    clubName: c.site.name,
    handle: c.site.instagramHandle,
    markPath: c.MARK_PATH,
    parts: Object.values(c.BUILDING_PARTS),
    fonts,
    title: event.title,
    subtitle: event.subtitle,
    format: event.format,
    formatLine: `${event.format}, ${dateNoYear}`,
    dateTimeLine: [dateNoYear, doors ? `doors ${doors}` : start, c.copy.event.price].filter(Boolean).join(", "),
    placeLine: `${roomOrTba}, ${event.location.building ?? c.site.venue.name}`,
    registerLine: "Register at the link in bio.",
    speakerPhoto: photoUri(speaker?.photo),
    facts: [
      { label: "Date", value: dateNoYear },
      ...(doors ? [{ label: "Doors", value: doors }] : start ? [{ label: "Time", value: start }] : []),
      { label: "Place", value: `${roomOrTba}, ${event.location.building ?? c.site.venue.name}` },
      { label: "Price", value: c.copy.event.price },
    ],
    carousel: (event.promo?.carousel ?? []).map((slide) => {
      if (slide.kind === "list") return { ...slide, items: withHeadshots(slide.items) };
      if (slide.kind === "details") return { ...slide, lines: slide.lines.map((l) => l.replace("{room}", roomOrTba)) };
      return slide;
    }),
  };
}

// 4. Render.
const events = c.events.filter((e) => e.status !== "past" && (only.length === 0 || only.includes(e.slug)));
if (events.length === 0) {
  console.error(only.length ? `No upcoming event with slug: ${only.join(", ")}` : "No upcoming events to render.");
  process.exit(1);
}
const browser = await chromium.launch();
try {
  for (const event of events) {
    const m = model(event);
    const dir = path.join(outRoot, event.slug, event.status === "draft" ? "preview" : "");
    fs.mkdirSync(dir, { recursive: true });
    const jobs = [
      ...m.carousel.map((slide, i) => ({
        file: `instagram-carousel-${i + 1}.png`, width: 1080, height: 1350, html: carouselSlide(m, slide, i, m.carousel.length),
      })),
      { file: "instagram-story.png", width: 1080, height: 1920, html: story(m) },
      { file: "eventbrite-banner-2160x1080.png", width: 2160, height: 1080, html: wideBanner(m, { width: 2160, height: 1080 }) },
      { file: "linkedin-post-1200x627.png", width: 1200, height: 627, html: wideBanner(m, { width: 1200, height: 627 }) },
    ];
    for (const job of jobs) {
      const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1 });
      await page.setContent(job.html, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(dir, job.file), clip: { x: 0, y: 0, width: job.width, height: job.height } });
      await page.close();
      console.log(path.join(dir, job.file));
    }
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
