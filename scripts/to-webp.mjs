// One-off: convert the oversized shop/ + gusti/ source PNGs to right-sized WebP.
// next/image optimizes delivery already; this trims the repo's source assets
// (1.6–2.9 MB PNGs → ~display-sized WebP). Run from the project root:
//   node scripts/to-webp.mjs
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const TARGETS = [
  { dir: "public/images/shop", maxW: 1920 }, // full-bleed hero / panel photos
  { dir: "public/images/gusti", maxW: 1200 }, // gallery tiles + flavor circles
];

let totalBefore = 0;
let totalAfter = 0;

for (const { dir, maxW } of TARGETS) {
  const pngs = readdirSync(dir).filter((f) => /\.png$/i.test(f));
  for (const f of pngs) {
    const src = join(dir, f);
    const out = join(dir, f.replace(/\.png$/i, ".webp"));
    const before = statSync(src).size;
    await sharp(src)
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out);
    const after = statSync(out).size;
    totalBefore += before;
    totalAfter += after;
    console.log(
      `${dir}/${f}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
    );
  }
}

console.log(
  `\nTOTAL  ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`
);
