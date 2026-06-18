// One-off photographic re-grade of the bottega product/shop photos.
//
// The runtime CSS `.photo-grade` layer supplies the WARM wash + vignette, so
// this pass intentionally stays neutral on temperature and instead does the
// "auto-tone + vibrance + clarity" work at the pixel level: a gentle contrast
// lift, a touch more saturation, and mild sharpening — then re-encodes WebP at
// high quality. Dimensions are preserved (no upscaling). Originals are backed
// up to scripts/_photo-originals/ on first run so the grade is reversible.
//
// Run:  node scripts/regrade-photos.mjs
// Undo: copy files back from scripts/_photo-originals/

import { readFile, writeFile, mkdir, copyFile, access } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BACKUP = join(ROOT, "scripts", "_photo-originals");

const TARGETS = [
  "public/images/shop/interior.webp",
  "public/images/shop/maestro.webp",
  "public/images/shop/shop1.webp",
  "public/images/shop/shop2.webp",
  "public/images/shop/shop3.webp",
  "public/images/gusti/fragola.webp",
  "public/images/gusti/nocciola.webp",
  "public/images/gusti/pistacchio.webp",
  "public/images/gusti/stracciatella.webp",
  "public/images/gusti/stracciatella-board.webp",
  "public/images/gusti/zabaione.webp",
];

const exists = (p) => access(p).then(() => true).catch(() => false);

async function run() {
  await mkdir(BACKUP, { recursive: true });

  for (const rel of TARGETS) {
    const abs = join(ROOT, rel);
    if (!(await exists(abs))) {
      console.warn(`skip (missing): ${rel}`);
      continue;
    }

    // Back up the original once.
    const bak = join(BACKUP, basename(rel));
    if (!(await exists(bak))) await copyFile(abs, bak);

    const input = await readFile(bak); // always grade from the pristine original
    const meta = await sharp(input).metadata();

    const graded = await sharp(input)
      .modulate({ saturation: 1.1, brightness: 1.01 }) // vibrance + a whisper of lift
      .linear(1.05, -6) // gentle contrast S-curve (deepen, then re-balance)
      .sharpen({ sigma: 0.6 }) // mild clarity, no halos
      .webp({ quality: 84, effort: 6 })
      .toBuffer();

    await writeFile(abs, graded);
    console.log(`graded ${rel}  (${meta.width}×${meta.height}, ${(graded.length / 1024).toFixed(0)} KB)`);
  }

  console.log("\nDone. Originals backed up in scripts/_photo-originals/");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
