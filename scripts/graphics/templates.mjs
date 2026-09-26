// HTML templates for event graphics. Every template gets a `model` (see generate.mjs) and
// returns a full HTML document sized exactly to its canvas.

const MAROON = "#7A003C";
const MAROON_DEEP = "#5C002D";
const GOLD = "#FDBF57";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Splits "One. Two. Three." into ["One.", "Two.", "Three."] so lists read as lines. */
export const sentences = (text) => text.split(/(?<=[.!?])\s+/).filter(Boolean);

function page({ width, height, fonts, body, extraCss = "" }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Cinzel; font-weight: 600; src: url(${fonts.cinzel}) format("truetype"); }
@font-face { font-family: Montserrat; font-weight: 500; src: url(${fonts.montserrat500}) format("truetype"); }
@font-face { font-family: Montserrat; font-weight: 600; src: url(${fonts.montserrat600}) format("truetype"); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
body { background: ${MAROON}; color: #fff; font-family: Montserrat, sans-serif; font-weight: 500;
  -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; position: relative; }
.display { font-family: Cinzel, serif; font-weight: 600; letter-spacing: 0.01em; }
.gold { color: ${GOLD}; }
.rule { width: 88px; height: 4px; background: ${GOLD}; }
.sig { display: flex; align-items: center; gap: 22px; }
.sig svg { flex-shrink: 0; }
.sig span { font-family: Cinzel, serif; font-weight: 600; letter-spacing: 0.03em; }
.ground { position: absolute; left: 0; right: 0; height: 2px; background: ${GOLD}; }
${extraCss}
</style></head><body>${body}</body></html>`;
}

/** The complete mark as inline SVG. */
const mark = (markPath, size, color = GOLD) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 1000 1000"><path fill="${color}" fill-rule="evenodd" d="${markPath}"/></svg>`;

/**
 * The architect's elevation of the mark's buildings (the website's hero drawing), sized to
 * `width` px. The view ends just below the ground line; guides are faint dashed lines.
 */
function elevation(parts, width, { stroke = 2.2, guides = true, groundOverhang = 0 } = {}) {
  const GROUND = 516.9, BELOW = 44;
  const vb = { x: 96, y: 84, w: 800, h: BELOW + GROUND - 84 };
  const height = Math.round((width * vb.h) / vb.w);
  const datums = [133.92, 236, 271.7]
    .map((y) => `<line x1="112" x2="${4000}" y1="${y}" y2="${y}" stroke-dasharray="3 9" />`)
    .join("");
  const axes = [250.6, 499.9, 737.2]
    .map((x) => `<line x1="${x}" x2="${x}" y1="95" y2="${GROUND + BELOW}" stroke-dasharray="18 7 3 7" />`)
    .join("");
  const paths = parts.map((d) => `<path d="${d}" />`).join("");
  return `<svg width="${width}" height="${height}" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" style="overflow:visible;display:block" fill="none" stroke="${GOLD}">
    <defs><clipPath id="g"><rect x="-5000" y="-5000" width="10000" height="${5000 + GROUND}" /></clipPath></defs>
    ${guides ? `<g stroke-width="1.2" opacity="0.32" vector-effect="non-scaling-stroke" style="vector-effect:non-scaling-stroke">${datums}${axes}</g>` : ""}
    <g clip-path="url(#g)" stroke-width="${stroke}" style="vector-effect:non-scaling-stroke">${paths.replace(/<path /g, '<path vector-effect="non-scaling-stroke" ')}</g>
    <line x1="${-4000 - groundOverhang}" x2="4000" y1="${GROUND}" y2="${GROUND}" stroke-width="${stroke}" vector-effect="non-scaling-stroke" />
  </svg>`;
}

/** Gold ring with the speaker's photo. */
const ring = (photo, size) =>
  `<div style="width:${size}px;height:${size}px;border-radius:50%;border:4px solid ${GOLD};padding:10px;flex-shrink:0">
     <div style="width:100%;height:100%;border-radius:50%;background:url(${photo}) center 30%/cover"></div></div>`;

const signature = (m, size = 64, font = 24) =>
  `<div class="sig">${mark(m.markPath, size)}<span style="font-size:${font}px">${esc(m.clubName)}</span></div>`;

/* ---------------------------------------------------------------------------------------- */
/* Instagram carousel, 1080 x 1350                                                           */
/* ---------------------------------------------------------------------------------------- */

export function carouselSlide(m, slide, index, total) {
  const W = 1080, H = 1350, PAD = 96;
  // Layout: signature at the top, content centred in the middle band, handle and page count at
  // the bottom. Slides with the elevation drawing reserve a band above the footer for it.
  const hasDrawing = slide.kind === "headline" || slide.kind === "details";
  const drawingWidth = slide.kind === "headline" ? 540 : 440;
  const drawingHeight = Math.round(drawingWidth * 0.596);
  const footerTop = H - 128;
  const mainTop = 210;
  const mainBottom = hasDrawing ? footerTop - drawingHeight - 70 : footerTop - 40;
  let content = "";

  if (slide.kind === "headline") {
    content = `
      <div class="display" style="font-size:104px;line-height:1.02">${sentences(slide.headline).map((l) => `<div>${esc(l)}</div>`).join("")}</div>
      <div class="rule" style="margin-top:44px"></div>
      <div class="gold" style="margin-top:30px;font-size:38px;font-weight:600">${esc(slide.smallLine)}</div>`;
  } else if (slide.kind === "speaker") {
    const [first, ...rest] = slide.lines;
    const comma = first.indexOf(",");
    const name = comma > 0 ? first.slice(0, comma + 1) : first;
    const org = comma > 0 ? first.slice(comma + 1).trim() : "";
    const facts = rest.flatMap(sentences);
    content = `
      ${m.speakerPhoto ? `<div style="margin-bottom:56px">${ring(m.speakerPhoto, 320)}</div>` : ""}
      <div class="display" style="font-size:${m.speakerPhoto ? 100 : 124}px;line-height:1.02">${esc(name)}</div>
      ${org ? `<div class="gold" style="margin-top:22px;font-size:44px;font-weight:600">${esc(org)}</div>` : ""}
      <div class="rule" style="margin-top:56px"></div>
      <div style="margin-top:34px;font-size:52px;line-height:1.3;font-weight:500">${facts.map((f) => `<div style="margin-top:18px;text-wrap:balance">${esc(f)}</div>`).join("")}</div>`;
  } else if (slide.kind === "list") {
    content = `
      <div class="display" style="font-size:88px;line-height:1.05;text-wrap:balance">${esc(slide.heading)}</div>
      <div style="margin-top:52px;border-top:2px solid rgba(253,191,87,.55)">
        ${slide.items
          .map(
            (it) => `<div style="display:flex;gap:32px;align-items:baseline;padding:26px 0;border-bottom:2px solid rgba(253,191,87,.55)">
               <span style="width:28px;height:3px;background:${GOLD};flex-shrink:0;transform:translateY(-14px)"></span>
               <span style="font-size:46px;line-height:1.25;font-weight:500;text-wrap:balance">${esc(it)}</span></div>`,
          )
          .join("")}
      </div>`;
  } else if (slide.kind === "details") {
    content = `
      <div class="display" style="font-size:100px;line-height:1.04">${esc(slide.lines[0])}</div>
      <div class="gold" style="margin-top:26px;font-size:50px;font-weight:600">${esc(slide.lines[1] ?? "")}</div>
      <div class="rule" style="margin-top:50px"></div>
      ${slide.lines.slice(2).map((l) => `<div style="margin-top:40px;font-size:50px;line-height:1.25;font-weight:600">${esc(l)}</div>`).join("")}
      ${slide.footnote ? `<div style="margin-top:36px;font-size:36px;line-height:1.45;color:rgba(255,255,255,.9);max-width:860px">${esc(slide.footnote)}</div>` : ""}`;
  }

  const body = `
    <div style="position:absolute;left:${PAD}px;top:${PAD}px">${signature(m)}</div>
    <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${mainTop}px;height:${mainBottom - mainTop}px;display:flex;flex-direction:column;justify-content:center">${content}</div>
    ${hasDrawing ? `<div style="position:absolute;right:${PAD - 24}px;top:${footerTop - drawingHeight - 34}px">${elevation(m.parts, drawingWidth)}</div>` : ""}
    <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${footerTop}px;display:flex;justify-content:space-between;font-size:26px;font-weight:600;color:rgba(255,255,255,.8)">
      <span>@${esc(m.handle)}</span><span>${index + 1} / ${total}</span></div>`;
  return page({ width: W, height: H, fonts: m.fonts, body });
}

/* ---------------------------------------------------------------------------------------- */
/* Instagram story, 1080 x 1920 (keeps text out of the top 250 px and bottom 340 px)         */
/* ---------------------------------------------------------------------------------------- */

export function story(m) {
  const W = 1080, H = 1920, PAD = 96;
  // Instagram covers roughly the top 250 px and bottom 340 px with its own UI. Text stays in
  // between; the drawing stands on a ground line just above the bottom zone.
  const ground = H - 340;
  const drawingWidth = 500;
  const drawingHeight = Math.round(drawingWidth * 0.596);
  const contentBottom = ground - drawingHeight + 20;
  const rows = m.facts
    .map(
      (f) => `<div style="display:grid;grid-template-columns:170px 1fr;gap:24px;padding:22px 0;border-bottom:2px solid rgba(253,191,87,.5)">
         <span style="font-size:23px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${GOLD};padding-top:9px">${esc(f.label)}</span>
         <span style="font-size:38px;line-height:1.3;font-weight:600">${esc(f.value)}</span></div>`,
    )
    .join("");
  const body = `
    <div style="position:absolute;left:${PAD}px;top:262px">${signature(m, 68, 25)}</div>
    <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:380px;height:${contentBottom - 380}px;display:flex;flex-direction:column;justify-content:center">
      <div class="gold" style="font-size:34px;font-weight:600">${esc(m.format)}</div>
      <div class="display" style="margin-top:18px;font-size:100px;line-height:1.04">${esc(m.title)}</div>
      ${m.subtitle ? `<div style="margin-top:26px;font-size:40px;line-height:1.35">${esc(m.subtitle)}</div>` : ""}
      <div style="margin-top:46px;border-top:2px solid rgba(253,191,87,.5)">${rows}</div>
      <div style="margin-top:40px;font-size:38px;font-weight:600">${esc(m.registerLine)}</div>
    </div>
    <div style="position:absolute;right:${PAD - 24}px;top:${ground - drawingHeight + 30}px">${elevation(m.parts, drawingWidth)}</div>`;
  return page({ width: W, height: H, fonts: m.fonts, body });
}

/* ---------------------------------------------------------------------------------------- */
/* Wide banners: Eventbrite 2160 x 1080 and LinkedIn 1200 x 627                              */
/* ---------------------------------------------------------------------------------------- */

export function wideBanner(m, { width, height }) {
  // Designed on a 2160 x 1080 grid and scaled: text column on the left, the elevation on the
  // right, both standing on one ground line that runs the full width.
  const s = width / 2160;
  const px = (n) => Math.round(n * s);
  const PAD = px(150);
  const ground = height - px(150);
  const drawingWidth = px(700);
  const drawingHeight = Math.round(drawingWidth * 0.596);
  const body = `
    <div style="position:absolute;left:${PAD}px;top:${px(110)}px">${signature(m, px(84), px(30))}</div>
    <div style="position:absolute;left:${PAD}px;top:${px(250)}px;width:${px(1080)}px;height:${ground - px(250) - px(40)}px;display:flex;flex-direction:column;justify-content:center">
      <div class="gold" style="font-size:${px(40)}px;font-weight:600">${esc(m.format)}</div>
      <div class="display" style="margin-top:${px(20)}px;font-size:${px(112)}px;line-height:1.04">${esc(m.title)}</div>
      ${m.subtitle ? `<div style="margin-top:${px(26)}px;font-size:${px(46)}px;line-height:1.3">${esc(m.subtitle)}</div>` : ""}
      <div class="rule" style="margin-top:${px(44)}px;width:${px(96)}px;height:${Math.max(3, px(5))}px"></div>
      <div style="margin-top:${px(36)}px;font-size:${px(42)}px;line-height:1.4;font-weight:600">${esc(m.dateTimeLine)}</div>
      <div style="margin-top:${px(6)}px;font-size:${px(38)}px;line-height:1.4;color:rgba(255,255,255,.88)">${esc(m.placeLine)}</div>
    </div>
    <div style="position:absolute;right:${px(130)}px;top:${ground - drawingHeight + Math.round(drawingWidth * 0.055)}px">${elevation(m.parts, drawingWidth, { stroke: Math.max(1.4, 2.2 * s) })}</div>`;
  return page({ width, height, fonts: m.fonts, body });
}

export const colors = { MAROON, MAROON_DEEP, GOLD };
