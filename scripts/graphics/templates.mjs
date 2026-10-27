// HTML templates for event and recruiting graphics. Every template gets a `model` (see
// generate.mjs) and returns a full HTML document sized exactly to its canvas.

const MAROON = "#7A003C";
const MAROON_DEEP = "#5C002D";
const GOLD = "#FDBF57";

/** Curly quotes and apostrophes, as a typesetter would set them. */
const smart = (s) =>
  s
    .replace(/(^|[\s([{])'/g, "$1\u2018")
    .replace(/'/g, "\u2019")
    .replace(/(^|[\s([{])"/g, "$1\u201C")
    .replace(/"/g, "\u201D");

const esc = (s) =>
  smart(String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Display type: the last two words stay together, so a heading never ends on one short word. */
const title = (s) => esc(s).replace(/ (\S+)$/, "\u00A0$1");

/** "Room, Building, University" breaks between its comma-separated parts while each part fits. */
const commaBreaks = (s) =>
  s.split(/(?<=,) /).map((part) => `<span style="display:inline-block">${esc(part)}</span>`).join(" ");

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
[data-fit] { display: flex; flex-direction: column; justify-content: center; }
${extraCss}
</style>
<script>
  // Shrinks the content of every [data-fit] box until it fits, so long copy never collides
  // with the drawing or runs off the canvas. Returns the boxes that still overflow.
  window.fitContent = () => {
    const overflowing = [];
    for (const box of document.querySelectorAll("[data-fit]")) {
      const inner = box.firstElementChild;
      let zoom = 1;
      while (inner.getBoundingClientRect().height > box.clientHeight + 0.5 && zoom > 0.7) {
        zoom -= 0.02;
        inner.style.zoom = zoom.toFixed(2);
      }
      if (inner.getBoundingClientRect().height > box.clientHeight + 0.5) overflowing.push(box.dataset.fit);
    }
    return overflowing;
  };
</script></head><body>${body}</body></html>`;
}

/** A box whose content is centred vertically and shrunk to fit if it's too tall. */
const fitBox = (name, { left, right, top, height, width }, content) =>
  `<div data-fit="${name}" style="position:absolute;left:${left}px;${right !== undefined ? `right:${right}px;` : ""}${width !== undefined ? `width:${width}px;` : ""}top:${top}px;height:${height}px"><div>${content}</div></div>`;

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
const ring = (photo, size, { border = 4, gap = 10 } = {}) =>
  `<div style="width:${size}px;height:${size}px;border-radius:50%;border:${border}px solid ${GOLD};padding:${gap}px;flex-shrink:0">
     <div style="width:100%;height:100%;border-radius:50%;background:url(${photo}) center 30%/cover"></div></div>`;

const signature = (m, size = 64, font = 24) =>
  `<div class="sig">${mark(m.markPath, size)}<span style="font-size:${font}px">${esc(m.clubName)}</span></div>`;

/** A list with a short gold dash before each item and gold hairlines between items. */
const dashList = (items, { font, pad, dash = 28, gap = 32 }) => `
  <div style="border-top:2px solid rgba(253,191,87,.55)">
    ${items
      .map(
        (it) => `<div style="display:flex;gap:${gap}px;align-items:baseline;padding:${pad}px 0;border-bottom:2px solid rgba(253,191,87,.55)">
           <span style="width:${dash}px;height:3px;background:${GOLD};flex-shrink:0;transform:translateY(-${Math.round(font * 0.3)}px)"></span>
           <span style="font-size:${font}px;line-height:1.25;font-weight:500;text-wrap:balance">${esc(it)}</span></div>`,
      )
      .join("")}
  </div>`;

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
    // Long headlines go a size down so their key phrases stay on one line.
    content = `
      <div class="display" style="font-size:${slide.headline.length > 40 ? 96 : 108}px;line-height:1.02">${sentences(slide.headline).map((l) => `<div>${title(l)}</div>`).join("")}</div>
      <div class="rule" style="margin-top:44px"></div>
      ${slide.smallLine ? `<div class="gold" style="margin-top:30px;font-size:38px;font-weight:600">${esc(slide.smallLine)}</div>` : ""}`;
  } else if (slide.kind === "speaker") {
    const [first, ...rest] = slide.lines;
    const comma = first.indexOf(",");
    const name = comma > 0 ? first.slice(0, comma + 1) : first;
    const org = comma > 0 ? first.slice(comma + 1).trim() : "";
    const facts = rest.flatMap(sentences);
    content = `
      ${m.speakerPhoto ? `<div style="margin-bottom:52px">${ring(m.speakerPhoto, 360)}</div>` : ""}
      <div class="display" style="font-size:${m.speakerPhoto ? 100 : 124}px;line-height:1.02">${title(name)}</div>
      ${org ? `<div class="gold" style="margin-top:22px;font-size:44px;font-weight:600">${esc(org)}</div>` : ""}
      <div class="rule" style="margin-top:52px"></div>
      <div style="margin-top:30px;font-size:52px;line-height:1.3;font-weight:500">${facts.map((f) => `<div style="margin-top:18px;text-wrap:balance">${esc(f)}</div>`).join("")}</div>`;
  } else if (slide.kind === "list") {
    content = `
      <div class="display" style="font-size:88px;line-height:1.05">${title(slide.heading)}</div>
      <div style="margin-top:52px">${dashList(slide.items, { font: 46, pad: 26 })}</div>`;
  } else if (slide.kind === "roles") {
    // Each role: its title, then its one-line description.
    content = `
      <div class="display" style="font-size:88px;line-height:1.05">${title(slide.heading)}</div>
      <div style="margin-top:48px;border-top:2px solid rgba(253,191,87,.55)">
        ${slide.roles
          .map(
            (r) => `<div style="padding:28px 0 30px;border-bottom:2px solid rgba(253,191,87,.55)">
               <div class="gold" style="font-size:44px;line-height:1.2;font-weight:600">${esc(r.title)}</div>
               <div style="margin-top:12px;font-size:35px;line-height:1.4;color:rgba(255,255,255,.92);text-wrap:balance">${esc(r.description)}</div></div>`,
          )
          .join("")}
      </div>`;
  } else if (slide.kind === "details") {
    // The gold rule comes before the call to action: after the gold second line when more lines
    // follow ("5:30 PM, Room..." then "Free. Register..."), otherwise before the second line.
    const [first, second, ...rest] = slide.lines;
    const ruleFirst = rest.length === 0 && !slide.footnote;
    const rule = `<div class="rule" style="margin-top:50px"></div>`;
    content = `
      <div class="display" style="font-size:100px;line-height:1.04">${title(first)}</div>
      ${ruleFirst ? rule : ""}
      ${second ? `<div class="gold" style="margin-top:${ruleFirst ? 40 : 26}px;font-size:50px;font-weight:600;text-wrap:balance">${esc(second)}</div>` : ""}
      ${ruleFirst ? "" : rule}
      ${rest.map((l) => `<div style="margin-top:40px;font-size:50px;line-height:1.25;font-weight:600">${esc(l)}</div>`).join("")}
      ${
        slide.footnote
          ? `<div style="margin-top:30px;font-size:36px;line-height:1.45;color:rgba(255,255,255,.9);max-width:860px">${sentences(slide.footnote)
              .map((s) => `<div style="margin-top:10px;text-wrap:pretty">${esc(s)}</div>`)
              .join("")}</div>`
          : ""
      }`;
  }

  const body = `
    <div style="position:absolute;left:${PAD}px;top:${PAD}px">${signature(m)}</div>
    ${fitBox("main", { left: PAD, right: PAD, top: mainTop, height: mainBottom - mainTop }, content)}
    ${hasDrawing ? `<div style="position:absolute;right:${PAD - 24}px;top:${footerTop - drawingHeight - 34}px">${elevation(m.parts, drawingWidth)}</div>` : ""}
    <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${footerTop}px;display:flex;justify-content:space-between;font-size:26px;font-weight:600;color:rgba(255,255,255,.8)">
      <span>@${esc(m.handle)}</span><span>${index + 1} / ${total}</span></div>`;
  return page({ width: W, height: H, fonts: m.fonts, body });
}

/* ---------------------------------------------------------------------------------------- */
/* Instagram stories, 1080 x 1920 (text stays out of the top 250 px and bottom 340 px)      */
/* ---------------------------------------------------------------------------------------- */

const STORY = { W: 1080, H: 1920, PAD: 96, TOP: 380, GROUND: 1920 - 340, DRAWING: 480 };

/** The parts every story shares: the signature at the top and the drawing on its ground line. */
function storyPage(m, content) {
  const { W, H, PAD, TOP, GROUND, DRAWING } = STORY;
  const drawingHeight = Math.round(DRAWING * 0.596);
  const contentBottom = GROUND - drawingHeight + 10;
  const body = `
    <div style="position:absolute;left:${PAD}px;top:262px">${signature(m, 68, 25)}</div>
    ${fitBox("story", { left: PAD, right: PAD, top: TOP, height: contentBottom - TOP }, content)}
    <div style="position:absolute;right:${PAD - 24}px;top:${GROUND - drawingHeight + 30}px">${elevation(m.parts, DRAWING)}</div>`;
  return page({ width: W, height: H, fonts: m.fonts, body });
}

/** Labelled rows, like the spec sheet on the website's event pages. */
const factRows = (facts) =>
  `<div style="border-top:2px solid rgba(253,191,87,.5)">${facts
    .map(
      (f) => `<div style="display:grid;grid-template-columns:170px 1fr;gap:24px;padding:20px 0;border-bottom:2px solid rgba(253,191,87,.5)">
         <span style="font-size:23px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${GOLD};padding-top:9px">${esc(f.label)}</span>
         <span style="font-size:38px;line-height:1.3;font-weight:600">${esc(f.value)}</span></div>`,
    )
    .join("")}</div>`;

export function story(m) {
  // With a speaker photo, the speaker's ring, name and title stand in for the subtitle, and the
  // price joins the closing line, so everything fits above the drawing.
  const speaker = m.speakerPhoto
    ? `<div style="margin-top:44px;display:flex;align-items:center;gap:40px">
         ${ring(m.speakerPhoto, 230, { gap: 8 })}
         <div><div class="display" style="font-size:54px;line-height:1.05">${title(m.speakerName)}</div>
           ${m.speakerTitle ? `<div class="gold" style="margin-top:14px;font-size:32px;line-height:1.3;font-weight:600;text-wrap:balance">${esc(m.speakerTitle)}</div>` : ""}</div>
       </div>`
    : m.subtitle
      ? `<div style="margin-top:26px;font-size:40px;line-height:1.35;text-wrap:balance">${esc(m.subtitle)}</div>`
      : "";
  const facts = m.speakerPhoto ? m.facts.filter((f) => f.label !== "Price") : m.facts;
  const closing = m.speakerPhoto ? `${m.price}. ${m.registerLine}` : m.registerLine;
  return storyPage(
    m,
    `<div class="gold" style="font-size:34px;font-weight:600">${esc(m.format)}</div>
     <div class="display" style="margin-top:18px;font-size:100px;line-height:1.04">${title(m.title)}</div>
     ${speaker}
     <div style="margin-top:46px">${factRows(facts)}</div>
     <div style="margin-top:38px;font-size:38px;font-weight:600">${esc(closing)}</div>`,
  );
}

export function recruitingStory(m) {
  return storyPage(
    m,
    `<div class="display" style="font-size:100px;line-height:1.04">${title(m.headline)}</div>
     <div class="rule" style="margin-top:46px"></div>
     <div class="gold" style="margin-top:44px;font-size:34px;font-weight:600">${esc(m.rolesHeading)}</div>
     <div style="margin-top:22px">${dashList(m.roles.map((r) => r.title), { font: 42, pad: 22, dash: 24, gap: 26 })}</div>
     <div style="margin-top:46px;font-size:46px;line-height:1.3;font-weight:600">${esc(m.apply)}</div>
     <div class="gold" style="margin-top:10px;font-size:40px;font-weight:600">${esc(m.linkInBio)}</div>`,
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Wide banners: Eventbrite 2160 x 1080 and LinkedIn 1200 x 627                              */
/* ---------------------------------------------------------------------------------------- */

/**
 * Designed on a 2160 x 1080 grid and scaled: the text column on the left, the speaker's photo
 * or the elevation on the right, with one ground line running the full width.
 */
function widePage(m, { width, height }, textColumn, { photo } = {}) {
  const s = width / 2160;
  const px = (n) => Math.round(n * s);
  const PAD = px(150);
  const ground = height - px(150);
  const drawingWidth = px(700);
  const drawingHeight = Math.round(drawingWidth * 0.596);
  const ringSize = px(600);
  const art = photo
    ? `<div style="position:absolute;right:${px(170)}px;top:${Math.round((ground - ringSize) / 2 + px(10))}px">${ring(photo, ringSize, { border: Math.max(3, px(6)), gap: px(16) })}</div>
       <div class="ground" style="top:${ground}px;height:${Math.max(1.5, px(2.6))}px"></div>`
    : `<div style="position:absolute;right:${px(130)}px;top:${ground - drawingHeight + Math.round(drawingWidth * 0.055)}px">${elevation(m.parts, drawingWidth, { stroke: Math.max(1.4, 2.2 * s) })}</div>`;
  const body = `
    <div style="position:absolute;left:${PAD}px;top:${px(110)}px">${signature(m, px(84), px(30))}</div>
    ${fitBox("text", { left: PAD, width: px(photo ? 1150 : 1080), top: px(264), height: ground - px(264) - px(40) }, textColumn(px))}
    ${art}`;
  return page({ width, height, fonts: m.fonts, body });
}

export function wideBanner(m, size) {
  return widePage(
    m,
    size,
    (px) => `
      <div class="gold" style="font-size:${px(40)}px;font-weight:600">${esc(m.format)}</div>
      <div class="display" style="margin-top:${px(20)}px;font-size:${px(108)}px;line-height:1.04">${title(m.title)}</div>
      ${m.subtitle ? `<div style="margin-top:${px(24)}px;font-size:${px(44)}px;line-height:1.3;text-wrap:balance">${esc(m.subtitle)}</div>` : ""}
      <div class="rule" style="margin-top:${px(44)}px;width:${px(96)}px;height:${Math.max(3, px(5))}px"></div>
      <div style="margin-top:${px(36)}px;font-size:${px(42)}px;line-height:1.4;font-weight:600">${esc(m.dateTimeLine)}</div>
      <div style="margin-top:${px(6)}px;font-size:${px(38)}px;line-height:1.4;color:rgba(255,255,255,.88)">${commaBreaks(m.placeLine)}</div>`,
    { photo: m.speakerPhoto },
  );
}

export function recruitingBanner(m, size) {
  return widePage(
    m,
    size,
    (px) => `
      <div class="display" style="font-size:${px(104)}px;line-height:1.04">${title(m.headline)}</div>
      <div class="rule" style="margin-top:${px(40)}px;width:${px(96)}px;height:${Math.max(3, px(5))}px"></div>
      <div style="margin-top:${px(34)}px;font-size:${px(40)}px;line-height:1.45;font-weight:600">${m.roles.map((r) => `<div>${esc(r.title)}</div>`).join("")}</div>
      <div style="margin-top:${px(30)}px;font-size:${px(40)}px;line-height:1.4;color:rgba(255,255,255,.9)">${esc(m.apply)}</div>
      <div class="gold" style="font-size:${px(40)}px;line-height:1.4;font-weight:600">${esc(m.teamPage)}</div>`,
  );
}

export const colors = { MAROON, MAROON_DEEP, GOLD };
