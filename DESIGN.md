# Design System — Artigiano Gelateria

> Read this before any visual or UI change. Fonts, colors, spacing, and aesthetic
> direction are defined here. Don't deviate without explicit approval.

## Product Context
- **What this is:** demo site for an artisan gelateria — storytelling homepage,
  pickup ordering (cono / coppetta / vaschetta + flavor selection), and a
  hardcoded admin CRM (prenotazioni, ordini, magazzino, fatturato, calendario).
- **Who it's for:** gelato lovers in Milano and Roma; the admin is for shop staff.
- **Space/industry:** premium artisan food / heritage gelateria ("dal 1978").
- **Project type:** marketing/storytelling site + light web app (pickup + admin).
- **Memorable thing:** an old-world artisan *bottega* — chocolate worked by hand,
  warm petrol-and-gold, the maestro's craft. Heritage, not candy-shop.

## Aesthetic Direction
- **Direction:** **Good Food** — editoriale gourmand, foto-first, serif appetitosi, toni di spezie/terra/miele.
- **Decoration level:** intentional — warm photography, a script signature, a
  hand-illustrated cartoon map; structure does most of the work.
- **Mood:** crafted, unhurried, premium-but-friendly. Old Italian laboratorio.
- **Signature move:** the whole public site scrolls HORIZONTALLY through
  full-screen panels; the homepage hero is a full-bleed **flavour slider** — a
  hand-held cone on its own colour field, auto-looping through gusti behind an
  oversized ghost name.

## Typography
- **Display / Hero:** **Playfair Display** (con italic per titoli) — all big
  titles, uppercase, tight leading. Editorial warmth, appetitoso.
- **Body / UI:** **Source Serif 4** — paragraphs, body text. Warm serif readability.
- **Label / Etichette uppercase:** **Libre Franklin** — eyebrows, label pills, admin tables.
- **Signature / Script:** **Pinyon Script** — used sparingly (brand flourish).
- **Loading:** `next/font/google` in `src/app/layout.tsx` → CSS vars
  `--font-fraunces`, `--font-hanken`, `--font-label`, `--font-pinyon`.
- **Class bridge (ported framework):** `.caviar` → Playfair Display, `.core` → Source Serif 4,
  `.cormorant` → Pinyon, `.label` → Libre Franklin (remapped in `globals.css`).
- **Scale:** giant display `clamp(34px → 132px)` (`.display-title`, `fs-120/130`);
  section titles `fs-60/70`; eyebrow/labels `clamp(12 → 15px)` uppercase,
  `letter-spacing .22em`; body `15–20px`, line-height ~1.6.

## Color
Tokens live in `globals.css` `@theme` (`--color-*`) and `theme-utils.css` `:root`
(`--primary`, `--secondary`, `--background-1/2`, `--black`, `--white`).

- **Approach:** warm editorial — spezie, terra, miele; fotografia protagonista.
- **Parchment** `#F5EDD8` — page background, text on dark (`--background-1`, `bg-cream`).
- **Cream** `#EDE0C4` — warm panels/cards (`--background-2`, `bg-gold`).
- **Espresso** `#2E1A0E` — PRIMARY DARK: headings, body text,
  dark surfaces (footer, panels), admin sidebar (`--secondary`). Sostituisce il petrolio.
- **scuro profondo** `#1E110A` — depth/hover on dark.
- **Saffron** `#D4973A` — ACCENT: eyebrows/labels, links, secondary chips,
  brand marks (`--primary`, `text-primary`/`bg-primary`). Sostituisce il nocciola oro.
- **Terracotta** `#C1603A` — CTA PRIMARIA: unica azione primaria per schermata
  (`.btn-pill`, "Conferma prenotazione", "Prenota il ritiro"). Sostituisce il rosso gelato.
- **Sage** `#7A8C6B` — soft secondary (cartoon-map parks, accents).
- **cocoa** `#6B4F3A` — muted text.
- **Blush Linen** `#D8C4B2` — bordi/separatori.
- **Semantic (admin only):** success `emerald-600`, warning `amber-600`,
  error/`rosso` `red-600`, info `blue-600`.
- **Hierarchy rule:** Saffron = brand accent + labels + secondary actions;
  **Terracotta = the one primary action** on a screen. Never use Terracotta for labels.

## Spacing
- **Base unit:** 4px (ported `--spacing-*` scale, rem→px: 5/10/15/20/30/40/50/60…).
- **Density:** comfortable → spacious (full-screen panels, `py-[80–120px]`).
- **Containers:** `.site-wrap` ≤1280px, `.content-wrap` ≤1000px; gutter `5vw`.

## Layout
- **Approach:** hybrid — creative-editorial horizontal storytelling for the
  public site, grid-disciplined (normal vertical) for the admin dashboard.
- **Whole public site = horizontal, all devices.** Every public route wraps its
  panels in `components/site/HorizontalScroll.tsx` — full-`svw` panels in a row.
  Pointer/wheel devices map vertical wheel → eased horizontal travel; touch
  devices scroll natively with CSS scroll-snap (`@media (hover:none)`). The hero
  pins (sticky, 2-viewport section) and scrubs 100 frames. There is **no**
  vertical-stack fallback; panel internals reflow responsively (stacked
  text/image on narrow screens), and content-heavy panels (forms, cards) may
  scroll vertically *within* a panel via `overflow-y-auto`.
- **Pickup** is a horizontal step-**wizard** (one panel per step, Back/Continua
  scrolls the track); **dove-trovarci** & **contact** are horizontal panels.
- **Admin** (`src/app/admin/*`) keeps a normal vertical layout; reachable from a
  visible "Admin" button in `SiteHeader` (nocciola, not rosso) + footer.
- **Border radius:** chips/pills `999px`; cards `14–18px`; inputs `10px`.

## Motion
- **Approach:** intentional but cinematic. Reveal-on-scroll (`[data-reveal]`,
  fade-up 0.9s `cubic-bezier(.22,.61,.36,1)`; `[data-reveal-stagger]` cascades
  children); an auto-looping full-bleed hero flavour slider (crossfade +
  colour-field tween); a scroll-driven horizontal parallax controller
  (`[data-px]`); GSAP map-pin drop
  (`back.out`); shared easing/duration tokens in `src/lib/motion.ts`. Horizontal
  travel lerp (`EASING 0.09`). Respects `prefers-reduced-motion` throughout.
- **Photography:** one editorial set — `<Figure>` frame (`.figure-frame` gold
  hairline + shadow) over a warm runtime grade (`.photo-grade`); source photos
  also get a pixel-level tone/vibrance/clarity pass (`scripts/regrade-photos.mjs`,
  sharp). Film grain (`.grain`) warms the dark cinematic panels.

## Brand
- **Name:** Artigiano Gelateria · "dal 1978" · "il maestro gelatiere".
- **Logo:** Fraunces wordmark ("Artigiano") + Hanken small-caps subtitle
  (`components/BrandLogo.tsx`), tones light/dark. No SVG emblem.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-16 | Bottega palette + Fraunces/Hanken/Pinyon adopted globally | Heritage artisan identity (from the "La Strega Nocciola" style guide, reused for Artigiano) |
| 2026-06-16 | Horizontal-scroll storytelling homepage + pinned scroll hero | Immersive locomotive-style storytelling; distinctive for an artisan gelato brand |
| 2026-06-16 | `.btn-pill` primary CTA → rosso `#B23A2C`; gold stays for labels/accents | Clear click hierarchy: rosso = primary action, gold = brand accent |
| 2026-06-16 | "Un'icona italiana" panel → petrol instead of gold bg | Cream-on-gold was low contrast; petrol fixes readability + gives the panel rhythm a dark beat |
| 2026-06-17 | Horizontal scroll on **all devices**, whole public site (overrides the prior "mobile/tablet stacks vertically") | User request: one consistent cinematic horizontal paradigm everywhere; Pickup becomes a horizontal step-wizard |
| 2026-06-17 | Cinematic motion elevation: shared `motion.ts` tokens, stagger reveals, `scrollLeft`-driven hero scrub + parallax controller (replaced fragile deep-panel ScrollTrigger positioning) | "Expensive/modern" feel that is reliable inside a custom horizontal scroller on every device |
| 2026-06-17 | Reinstated the built-but-unused `ProcessScroll` "il processo" panels into the homepage | Dead code → flagship content; "mettere ordine" |
| 2026-06-17 | Photo quality = both: runtime `.photo-grade`/`<Figure>` + baked sharp re-grade of shop/gusti sources | User chose "Entrambi"; Adobe MCP can't read local repo files, so the pixel pass is done locally with sharp |
| 2026-06-17 | Visible "Admin" entry in `SiteHeader` (nocciola, not rosso) | User request: make the admin reachable from the public chrome |
| 2026-06-17 | Full-screen overlay nav (`SiteNavOverlay`): minimal header (logo · IT/EN · rosso "Prenota" · "Naviga"), petrolio overlay with oversized Fraunces links + newsletter/social/legal | User wants a "menu a tendina" like the Crema reference; replaces inline+collapse nav on all devices |
| 2026-06-17 | Admin entry moved into the overlay's legal row ("Area riservata") — **less** visible (supersedes the visible header pill); login adds one-click "Entra nella demo" | User: keep admin discreet but let a client see everything without typing credentials |
| 2026-06-17 | Hero rethought: **cream** background matching the frame's own light counter, edges feathered into panna (no border), dark Fraunces title, lower canvas DPR, scroll cue removed | Frames are light + only 1136px — a dark frame showed a hard border and upscaling pixels; "ragiona al contrario" |
| 2026-06-17 | "Il processo" condensed from 4 panels to **one** (4-step numbered row) | Four gelato story panels + four process panels read repetitive |
| 2026-06-17 | Per-city illustrated maps (`CartoonMap`): line-art landmarks + rosso gelato-cup pin per Cosenza/Catanzaro/Lamezia | Reference-style map; shows where each bottega sits among real monuments/piazzas |
| 2026-06-17 | Admin scoped per-gelateria: `AdminScope` store + `Tutte/Cosenza/Catanzaro/Lamezia` switcher; per-boutique selectors in `admin-data.ts`; "Tutte" = sum/union | User: split prenotazioni/ordini/merce/fatturato per shop to avoid errors, plus an aggregate view |
| 2026-06-18 | Newsletter sign-up lives **only** in the nav overlay (removed from all footers; footer is a brand sign-off) | User wants it only in the toggle menu |
| 2026-06-18 | Admin entry surfaced as an understated "Gestionale" chip in the overlay + footer (was too hidden) | User couldn't find it after the "less visible" change |
| 2026-06-18 | Pickup is a **controlled, gated** horizontal wizard (own carousel, not the free-scroll track): off-screen steps are `inert`, "Continua" is disabled until the step's required fields are filled, the stepper can't skip ahead | User: every step mandatory, "se non si compila non si può andare avanti" to avoid order omissions |
| 2026-06-30 | Adottato design system **Good Food** (vault) — remap token colori + font su Playfair/Source Serif 4/Libre Franklin; petrolio→espresso, rosso→terracotta, oro→saffron | Evoluzione editoriale gourmand: foto protagonista, serif appetitosi, palette spezie/terra/miele |
| 2026-06-30 | Hero homepage rifatta: da sequenza colata-di-cioccolato (`HeroSequence`) a **flavour slider full-bleed** (`GelatoHero`) — cono in mano sul campo-colore del gusto, nome ghost Playfair, **auto-loop** dei gusti, frecce ←→ per il gusto + cue "Scorri →" verso la sezione successiva | Richiesta utente: hero "showcase gusti" stile reference, foto cono protagonista. `HeroSequence` + `hero-frames/` restano nel repo ma inutilizzati |
| 2026-06-30 | Header **sempre trasparente su tutte le pagine** (niente barra cream opaca); il **tono del testo si adatta da solo** al pannello sotto — campiona la luminanza dello sfondo subito sotto la barra (`elementsFromPoint`, salta gli scrim `pointer-events:none`) → testo chiaro su pannelli scuri, scuro su pannelli chiari | La barra opaca copriva i testi in cima a ogni pagina; trasparente + tono auto risolve contrasto su hero scuro e sezioni chiare/scure |
| 2026-06-30 | Foto cono hero: watermark ✦ del generatore rimosso (clone del fondo) + colore fondo campionato per gusto (`scripts/hero-cono.mjs`, prolunga la foto bordo-a-bordo). I fondi-gusto (oliva/rosa/ocra/taupe) sono una **deroga hero-only** alla palette parchment; CTA "Ordina" = testo Playfair bianco (non pill terracotta, invisibile sui fondi gusto) | Asset puliti + contrasto: terracotta sparirebbe sul rosso fragola |
| 2026-06-30 | "Il processo" rifatto: da riga numerata scura a **timeline ORIZZONTALE con foto** (`ProcessTimeline`, `motion/react`) — galleria `.h-scroll` di 4 card-foto (una per step) su una **rotaia orizzontale che si riempie oro→verde foresta** allo scroll (`useScroll` scrollXProgress), puntini + etichette che si accendono, **tema parchment chiaro**. Coerente col paradigma orizzontale del sito | Richiesta utente: immagini + orizzontale, non verticale. Aggiunto dep `motion`; `ProcessScroll` resta nel repo ma inutilizzato |
