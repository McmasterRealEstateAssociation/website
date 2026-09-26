// Prepares photos for the website: fixes orientation, strips all metadata (including GPS
// location), resizes to at most 2400 px on the long edge, and saves optimized JPEGs.
//
// Usage:
//   npm run photos -- <folder> <photo> [photo ...]
// Examples:
//   npm run photos -- 2026-10-leo-puskar "C:\Users\me\Pictures\IMG_1234.jpg"
//   npm run photos -- team "C:\Users\me\Pictures\justin.jpg"
//
// Photos are saved into content/photos/<folder>/ with clean lowercase names. Keep the
// originals outside the repo.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [folder, ...inputs] = process.argv.slice(2);
if (!folder || inputs.length === 0) {
  console.error('Usage: npm run photos -- <folder> <photo> [photo ...]');
  process.exit(1);
}
const outDir = path.join("content", "photos", folder);
fs.mkdirSync(outDir, { recursive: true });

for (const input of inputs) {
  const base = path
    .basename(input, path.extname(input))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const out = path.join(outDir, `${base}.jpg`);
  // sharp drops metadata unless asked to keep it; .rotate() applies the camera orientation first.
  const info = await sharp(input)
    .rotate()
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
console.log("\nNow add each photo to content/site.ts (see HOW-TO-UPDATE.md).");
