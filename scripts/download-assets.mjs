// Downloads real assets from gelatocrema.com (Shopify CDN) into public/.
// Run: node scripts/download-assets.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const BASE = "https://gelatocrema.com/cdn/shop";
const FILES = `${BASE}/files`;
const ASSETS = `${BASE}/t/2/assets`;

// [remoteURL, localPath]
const MAP = [
  // Fonts (real faces used by the theme)
  [`${FILES}/CaviarDreams.ttf?v=1692602417`, "public/fonts/CaviarDreams.ttf"],
  [`${FILES}/Caviar_Dreams_Bold.ttf?v=1692602417`, "public/fonts/CaviarDreams-Bold.ttf"],
  [`${FILES}/CoreCircus.ttf?v=1692602381`, "public/fonts/CoreCircus.ttf"],
  [`${FILES}/CormorantGaramond-Regular.otf?v=1692602382`, "public/fonts/CormorantGaramond-Regular.otf"],
  [`${FILES}/CormorantGaramond-Italic.otf?v=1692602381`, "public/fonts/CormorantGaramond-Italic.otf"],
  [`${FILES}/CormorantGaramond-MediumItalic.otf?v=1692602382`, "public/fonts/CormorantGaramond-MediumItalic.otf"],
  [`${FILES}/CormorantGaramond-SemiBold.otf?v=1692602382`, "public/fonts/CormorantGaramond-SemiBold.otf"],
  [`${FILES}/CormorantGaramond-SemiBoldItalic.otf?v=1692602382`, "public/fonts/CormorantGaramond-SemiBoldItalic.otf"],

  // Logos & brand
  [`${FILES}/logo_color.svg`, "public/icons/logo_color.svg"],
  [`${FILES}/logo_white.svg`, "public/icons/logo_white.svg"],
  [`${FILES}/premio_3_coni.png`, "public/images/home/premio_3_coni.png"],

  // Feature icons
  [`${FILES}/icon-gluten.svg`, "public/icons/icon-gluten.svg"],
  [`${FILES}/icon-natural.svg`, "public/icons/icon-natural.svg"],
  [`${FILES}/icon-vegan.svg`, "public/icons/icon-vegan.svg"],

  // UI / social / arrow icons
  [`${ASSETS}/icon-instagram-b.svg`, "public/icons/icon-instagram-b.svg"],
  [`${ASSETS}/icon-instagram-w.svg`, "public/icons/icon-instagram-w.svg"],
  [`${ASSETS}/icon-fb-b.svg`, "public/icons/icon-fb-b.svg"],
  [`${ASSETS}/icon-fb-w.svg`, "public/icons/icon-fb-w.svg"],
  [`${ASSETS}/icon-arrow.svg`, "public/icons/icon-arrow.svg"],
  [`${ASSETS}/icon-arrow-dx.svg`, "public/icons/icon-arrow-dx.svg"],
  [`${ASSETS}/icon-arrow-sx.svg`, "public/icons/icon-arrow-sx.svg"],
  [`${ASSETS}/checkmark.svg`, "public/icons/checkmark.svg"],
  [`${ASSETS}/icon-cv.svg`, "public/icons/icon-cv.svg"],

  // Home / product imagery
  [`${FILES}/0C5A2584-hero-ritoccata.jpg`, "public/images/home/hero.jpg"],
  [`${FILES}/0C5A2546.jpg`, "public/images/home/story-1.jpg"],
  [`${FILES}/0C5A2685_5c1729f8-f132-4527-a92e-0e33a43eb5bc.jpg`, "public/images/home/story-2.jpg"],
  [`${FILES}/coni-full.jpg`, "public/images/home/coni-full.jpg"],
  [`${FILES}/gelato_1.png`, "public/images/home/gelato_1.png"],
  [`${FILES}/gelato_2.png`, "public/images/home/gelato_2.png"],
  [`${FILES}/cono.png`, "public/images/home/cono.png"],
  [`${FILES}/coffee.png`, "public/images/home/coffee.png"],
  [`${FILES}/Cioccolato_Chuao_2.jpg`, "public/images/home/cioccolato-chuao.jpg"],
  [`${FILES}/coppetta-contact-us-def.png`, "public/images/home/coppetta.png"],
  [`${FILES}/lavora-con-noi.png`, "public/images/home/lavora-con-noi.png"],

  // Stili di gelato section images
  [`${FILES}/s3.png`, "public/images/stili/s3.png"],
  [`${FILES}/s4.png`, "public/images/stili/s4.png"],
  [`${FILES}/s5.png`, "public/images/stili/s5.png"],
  [`${FILES}/s6.png`, "public/images/stili/s6.png"],
  [`${FILES}/s7.png`, "public/images/stili/s7.png"],
  [`${FILES}/s8.png`, "public/images/stili/s8.png"],
  [`${FILES}/s9.png`, "public/images/stili/s9.png"],
  [`${FILES}/s10.png`, "public/images/stili/s10.png"],

  // Boutique photos
  [`${FILES}/Via_Fiori_Chiari.jpg`, "public/images/boutiques/fiori-chiari.jpg"],
  [`${FILES}/Via_G._da_Procida_esterno.jpg`, "public/images/boutiques/procida.jpg"],
  [`${FILES}/Piazza_Napoli-esterno.jpg`, "public/images/boutiques/piazza-napoli.jpg"],
  [`${FILES}/boutique-crema-roma-via-giulia-18.jpg`, "public/images/boutiques/via-giulia.jpg"],
  [`${FILES}/CREMA_-_Via_Leone_IV_62a_-_Facciata.jpg`, "public/images/boutiques/leone-iv.jpg"],
  [`${FILES}/boutique_slide_1.jpg`, "public/images/boutiques/slide-1.jpg"],
  [`${FILES}/boutique_slide_2.jpg`, "public/images/boutiques/slide-2.jpg"],
  [`${FILES}/BOUTIQUES-PACKAGING-B.jpg`, "public/images/boutiques/packaging.jpg"],
  [`${FILES}/CREMA-MASSA-8.jpg`, "public/images/boutiques/interior.jpg"],
  [`${FILES}/CATTABRICA-2-ORIZZONTALE.jpg`, "public/images/boutiques/cattabrica-h.jpg"],
  [`${FILES}/CATTABRICA-2-VERTICALE.jpg`, "public/images/boutiques/cattabrica-v.jpg"],

  // Maps
  [`${FILES}/milano_mappa.png`, "public/images/maps/milano.png"],
  [`${FILES}/Piantina-Roma-con-scritte-maggio-2026-2-punti-vendita.png`, "public/images/maps/roma.png"],
];

async function fetchOne([url, path]) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36" },
    });
    if (!res.ok) return { path, ok: false, status: res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buf);
    return { path, ok: true, bytes: buf.length };
  } catch (e) {
    return { path, ok: false, status: e.message };
  }
}

async function run() {
  const BATCH = 4;
  const results = [];
  for (let i = 0; i < MAP.length; i += BATCH) {
    const batch = MAP.slice(i, i + BATCH);
    results.push(...(await Promise.all(batch.map(fetchOne))));
  }
  let ok = 0, fail = 0;
  for (const r of results) {
    if (r.ok) { ok++; console.log(`  ok  ${r.path} (${r.bytes}b)`); }
    else { fail++; console.log(`FAIL  ${r.path} [${r.status}]`); }
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed of ${results.length}`);
}
run();
