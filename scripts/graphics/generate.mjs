// Renders on-brand graphics from content/site.ts.
//
// For an event:
//   - Instagram carousel slides (1080 x 1350) from the event's promo.carousel
//   - an Instagram story (1080 x 1920)
//   - an Eventbrite banner (2160 x 1080)
//   - a LinkedIn post image (1200 x 627)
// For team recruiting (from the recruiting block and recruitingPromo):
//   - Instagram carousel slides (1080 x 1350): the headline, the open roles, how to apply
//   - an Instagram story (1080 x 1920)
//   - a LinkedIn post image (1200 x 627)
//
// Usage:
//   npm run graphics                      every upcoming (draft or announced) event
//   npm run graphics -- 2026-11-leo-puskar
//   npm run graphics -- recruiting
//   npm run graphics -- 2026-11-leo-puskar --out "D:\somewhere"
//
// Output goes into the brand kit next to this repo (C:\MREA\brand-kit), or the --out folder:
//   events\<event-slug>\         draft events go into a preview\ subfolder so nobody posts them by mistake
//   recruiting-<year>\           recruiting that hasn't opened yet goes into a preview\ subfolder
import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { eventLinkedIn, eventSlide, eventStory, recruitingBanner, recruitingSlide, recruitingStory, wideBanner } from "./templates.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
const kitRoot = outFlag >= 0 ? path.resolve(args[outFlag + 1]) : path.resolve(repo, "..", "brand-kit");
const only = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");

// 1. Bundle the TypeScript content (and its photo imports) into something Node can load.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mrea-graphics-"));
await build({
  stdin: {
    contents: `export * from "./content/site"; export * from "./lib/events"; export * from "./lib/dates";
      export { fill } from "./lib/text"; export { recruitingStatusOn } from "./lib/recruiting-status";
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
const photoFile = (photo) => {
  const src = typeof photo?.src === "string" ? photo.src : photo?.src?.src;
  return src ? path.resolve(tmp, src) : undefined;
};
const brand = {
  clubName: c.site.name,
  handle: c.site.instagramHandle,
  markPath: c.MARK_PATH,
  parts: Object.values(c.BUILDING_PARTS),
  fonts,
};

// 3. Build the data each template needs.
async function eventModel(event) {
  const roomOrTba = event.location.room || c.copy.event.roomTba;
  const doors = c.doorsTime(event);
  const start = c.startTime(event);
  const dateNoYear = event.start ? c.formatLongDateNoYear(event.start) : c.eventDateLong(event);
  const dateTimeLine = [dateNoYear, doors ? `doors ${doors}` : start, c.copy.event.price].filter(Boolean).join(", ");
  const photo = photoFile(event.speakers[0]?.photo);
  const carousel = (event.promo?.carousel ?? []).map((slide) => {
    if (slide.kind !== "list") return slide;
    const items = slide.items.filter((i) => !i.onlyWithHeadshots || event.headshotsConfirmed).map((i) => i.text);
    if (items.length > 4) console.warn(`  Warning: "${slide.heading}" has ${items.length} items. Four or fewer read at a glance.`);
    return { ...slide, items };
  });
  return {
    ...brand,
    // The Eventbrite banner.
    title: event.title,
    subtitle: event.subtitle,
    format: event.format,
    dateTimeLine,
    placeLine: `${roomOrTba}, ${event.location.building ?? c.site.venue.name}`,
    // The carousel, story and LinkedIn image. The story and LinkedIn image repeat the cover.
    speakerPhoto: photo && dataUri(photo, "image/jpeg"),
    speakerPhotoWidth: photo && (await sharp(photo).metadata()).width,
    carousel,
    cover: carousel.find((s) => s.kind === "cover") ?? { headline: event.title, subline: event.subtitle, bottomLine: dateTimeLine },
  };
}

function recruitingModel() {
  const { recruiting: r, recruitingPromo: p } = c;
  // A calendar date at noon UTC is the same day in Toronto: "Wednesday, November 4".
  const values = { season: r.season, closesOn: c.formatLongDateNoYear(`${r.closesOn}T12:00:00Z`) };
  const headline = c.fill(p.headline, values);
  const apply = c.fill(p.apply, values);
  return {
    ...brand,
    headline,
    apply,
    linkInBio: p.linkInBio,
    rolesHeading: p.rolesHeading,
    roles: r.roles,
    teamPage: `${c.site.url.replace(/^https?:\/\//, "")}/team`,
    carousel: [
      { kind: "headline", headline },
      { kind: "roles", heading: p.rolesHeading, roles: r.roles },
      { kind: "details", lines: [apply, p.linkInBio] },
    ],
  };
}

const carouselJobs = (m, render) =>
  m.carousel.map((slide, i) => ({
    file: `instagram-carousel-${i + 1}.png`, width: 1080, height: 1350, html: render(m, slide, i, m.carousel.length),
  }));

// 4. Decide what to render.
const sets = [];
const wantsRecruiting = only.includes("recruiting");
const eventSlugs = only.filter((a) => a !== "recruiting");

if (wantsRecruiting) {
  const status = c.recruitingStatusOn(c.recruiting, new Date());
  if (status === "closed") {
    console.error("Recruiting is closed (see the recruiting block in content/site.ts), so there's nothing to promote.");
    process.exit(1);
  }
  const m = recruitingModel();
  sets.push({
    dir: path.join(kitRoot, `recruiting-${c.recruiting.season.slice(0, 4)}`, status === "open" ? "" : "preview"),
    jobs: [
      ...carouselJobs(m, recruitingSlide),
      { file: "instagram-story.png", width: 1080, height: 1920, html: recruitingStory(m) },
      { file: "linkedin-post-1200x627.png", width: 1200, height: 627, html: recruitingBanner(m, { width: 1200, height: 627 }) },
    ],
  });
}

if (!wantsRecruiting || eventSlugs.length > 0) {
  const events = c.events.filter((e) => e.status !== "past" && (eventSlugs.length === 0 || eventSlugs.includes(e.slug)));
  if (events.length === 0) {
    console.error(eventSlugs.length ? `No upcoming event with slug: ${eventSlugs.join(", ")}` : "No upcoming events to render.");
    process.exit(1);
  }
  for (const event of events) {
    const m = await eventModel(event);
    sets.push({
      dir: path.join(kitRoot, "events", event.slug, event.status === "draft" ? "preview" : ""),
      jobs: [
        ...carouselJobs(m, eventSlide),
        { file: "instagram-story.png", width: 1080, height: 1920, html: eventStory(m) },
        { file: "eventbrite-banner-2160x1080.png", width: 2160, height: 1080, html: wideBanner(m, { width: 2160, height: 1080 }) },
        { file: "linkedin-post-1200x627.png", width: 1200, height: 627, html: eventLinkedIn(m) },
      ],
    });
  }
}

// 5. Render.
const browser = await chromium.launch();
try {
  for (const { dir, jobs } of sets) {
    fs.mkdirSync(dir, { recursive: true });
    for (const job of jobs) {
      const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1 });
      await page.setContent(job.html, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const overflowing = await page.evaluate(() => window.fitContent());
      const enlarged = await page.evaluate(() => document.querySelector("[data-enlarged]") !== null);
      await page.screenshot({ path: path.join(dir, job.file), clip: { x: 0, y: 0, width: job.width, height: job.height } });
      await page.close();
      console.log(path.join(dir, job.file));
      if (overflowing.length) console.warn(`  Warning: text is too long to fit (${overflowing.join(", ")}). Shorten it in content/site.ts.`);
      if (enlarged) console.warn("  Warning: the speaker's photo is smaller than its ring and may look soft. Use a larger photo.");
    }
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
