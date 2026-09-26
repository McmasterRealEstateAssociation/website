// Full-page screenshots of every route at phone, tablet and desktop sizes.
// Usage: node scripts/qa/screenshots.mjs <outDir> [baseUrl] [route ...]
// Start the site first (npm run build && npx next start -p 3100).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [outDir = "qa-shots", base = "http://localhost:3100", ...only] = process.argv.slice(2);
const routes = only.length
  ? only
  : ["/", "/events", "/events/2026-01-brokerage-built-from-scratch", "/team", "/speak", "/join", "/links", "/this-page-does-not-exist"];
const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const vp of viewports) {
    // Reduced motion shows the hero drawing in its finished state.
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const route of routes) {
      const res = await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const name = (route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_")) + `-${vp.name}.png`;
      await page.screenshot({ path: path.join(outDir, name), fullPage: true });
      console.log(vp.name.padEnd(5), String(res?.status()).padEnd(4), overflow > 0 ? `OVERFLOW ${overflow}px` : "ok", route);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
