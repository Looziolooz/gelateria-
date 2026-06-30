// Prepare the hero cone photos (hand-held cone on a solid flavor-coloured
// backdrop). For each source PNG we:
//   1. Clone a clean left-adjacent patch over the bottom-right corner to erase
//      the AI generator's ✦ watermark (seamless because the backdrop is a flat
//      colour field).
//   2. Sample the backdrop colour from a clean patch → printed as hex so the
//      hero panel background can extend the photo edge-to-edge with no seam.
//   3. Re-encode to right-sized WebP.
//
// Source: C:\Users\loren\Pictures\gelateria\hero cono
// Out:    public/images/hero-cono/{flavor}.webp
//
// Run: node scripts/hero-cono.mjs

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = "C:/Users/loren/Pictures/gelateria/hero cono";
const OUT_DIR = join(ROOT, "public", "images", "hero-cono");

const JOBS = [
  { slug: "pistacchio", file: "pistacchio.png" },
  { slug: "fragola", file: "fragola.png" },
  { slug: "zabaione", file: "zabaione.png" },
  { slug: "stracciatella", file: "Gemini_Generated_Image_y2d8v4y2d8v4y2d8.png" },
];

const toHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

async function sampleHex(input, left, top, w, h) {
  const { data } = await sharp(input)
    .extract({ left, top, width: w, height: h })
    .resize(1, 1, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return toHex(data[0], data[1], data[2]);
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const colors = {};

  for (const { slug, file } of JOBS) {
    const input = await readFile(join(SRC_DIR, file));
    const meta = await sharp(input).metadata();
    const W = meta.width ?? 0;
    const H = meta.height ?? 0;

    // Backdrop colour — sample a clean patch in the upper-right (clear of the
    // centred cone and the left hand).
    const bgHex = await sampleHex(
      input,
      Math.round(W * 0.8),
      Math.round(H * 0.1),
      Math.round(W * 0.12),
      Math.round(H * 0.12),
    );
    colors[slug] = bgHex;

    // Erase the ✦ watermark: clone the patch immediately to the LEFT of the
    // bottom-right corner over the corner itself (both are flat backdrop).
    const bw = Math.round(W * 0.2);
    const bh = Math.round(H * 0.24);
    const destLeft = W - bw;
    const destTop = H - bh;
    const patch = await sharp(input)
      .extract({ left: destLeft - bw, top: destTop, width: bw, height: bh })
      .toBuffer();

    const out = await sharp(input)
      .composite([{ input: patch, left: destLeft, top: destTop }])
      .webp({ quality: 82, effort: 6 })
      .toBuffer();

    await writeFile(join(OUT_DIR, `${slug}.webp`), out);
    console.log(
      `${slug.padEnd(13)} ${W}×${H}  bg ${bgHex}  → ${(out.length / 1024).toFixed(0)} KB`,
    );
  }

  console.log("\nBackdrop colours:");
  console.log(JSON.stringify(colors, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
