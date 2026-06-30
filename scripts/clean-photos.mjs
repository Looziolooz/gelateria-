// Clean the AI-generated product photos: remove the generator's ✦ sparkle
// watermark (bottom-right corner) by cropping the top-left 92% of the frame,
// then apply one gentle, uniform grade so gusti + shop read as a single
// editorial set. Always processes from a pristine pre-clean backup, so it's
// idempotent and reversible (restore from scripts/_photo-pre-clean/).
//
// Run:  node scripts/clean-photos.mjs
// Undo: copy files back from scripts/_photo-pre-clean/

import { readFile, writeFile, mkdir, copyFile, access } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BACKUP = join(ROOT, "scripts", "_photo-pre-clean");

// Fraction of width/height kept (top-left anchored) → removes the bottom-right
// corner where the watermark sits. 0.92 = drop the right 8% + bottom 8%.
const KEEP = 0.92;

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

    // Back up the current file once; always grade from the pristine backup.
    const bak = join(BACKUP, basename(rel));
    if (!(await exists(bak))) await copyFile(abs, bak);

    const input = await readFile(bak);
    const meta = await sharp(input).metadata();
    const W = meta.width ?? 0;
    const H = meta.height ?? 0;
    const cw = Math.max(1, Math.round(W * KEEP));
    const ch = Math.max(1, Math.round(H * KEEP));

    const cleaned = await sharp(input)
      .extract({ left: 0, top: 0, width: cw, height: ch }) // drop bottom-right corner (watermark)
      .modulate({ saturation: 1.05, brightness: 1.0 })     // uniform vibrance
      .linear(1.03, -3)                                    // gentle, consistent contrast
      .sharpen({ sigma: 0.5 })                             // light clarity
      .webp({ quality: 84, effort: 6 })
      .toBuffer();

    await writeFile(abs, cleaned);
    console.log(`cleaned ${rel}  ${W}×${H} → ${cw}×${ch}  (${(cleaned.length / 1024).toFixed(0)} KB)`);
  }

  console.log("\nDone. Pre-clean backups in scripts/_photo-pre-clean/");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
