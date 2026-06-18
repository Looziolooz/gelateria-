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
- **Direction:** warm bottega / heritage-editorial.
- **Decoration level:** intentional — warm photography, a script signature, a
  hand-illustrated cartoon map; structure does most of the work.
- **Mood:** crafted, unhurried, premium-but-friendly. Old Italian laboratorio.
- **Signature move:** desktop homepage scrolls HORIZONTALLY through full-screen
  panels; the hero is a pinned, scroll-scrubbed chocolate-pour frame sequence.

## Typography
- **Display / Hero:** **Fraunces** (variable serif, optical sizing) — all big
  titles, uppercase, tight leading. Vintage warmth, the "gusto di una volta" feel.
- **Body / UI / Labels:** **Hanken Grotesk** — paragraphs, nav, form labels,
  admin. Warm humanist grotesque, highly readable.
- **Signature / Script:** **Pinyon Script** — used sparingly (brand flourish).
- **Loading:** `next/font/google` in `src/app/layout.tsx` → CSS vars
  `--font-fraunces`, `--font-hanken`, `--font-pinyon`.
- **Class bridge (ported framework):** `.caviar` → Fraunces, `.core` → Hanken,
  `.cormorant` → Pinyon (remapped in `globals.css`).
- **Scale:** giant display `clamp(34px → 132px)` (`.display-title`, `fs-120/130`);
  section titles `fs-60/70`; eyebrow/labels `clamp(12 → 15px)` uppercase,
  `letter-spacing .22em`; body `15–20px`, line-height ~1.6.

## Color
Tokens live in `globals.css` `@theme` (`--color-*`) and `theme-utils.css` `:root`
(`--primary`, `--secondary`, `--background-1/2`, `--black`, `--white`).

- **Approach:** balanced — warm neutrals carry it, gold accents, rosso pops.
- **panna** `#F6EFE1` — page background, text on dark (`--background-1`, `bg-cream`).
- **mattone** `#E4D3B6` — warm panels/cards (`--background-2`, `bg-gold`).
- **verde bottega (petrolio)** `#2C595E` — PRIMARY DARK: headings, body text,
  dark surfaces (footer, the "un'icona" panel), admin sidebar (`--secondary`).
- **petrolio scuro** `#1F4348` — depth/hover on dark.
- **nocciola oro** `#AC7B40` — ACCENT: eyebrows/labels, links, secondary chips,
  brand marks (`--primary`, `text-primary`/`bg-primary`).
- **rosso gelato** `#B23A2C` — POP, reserved for the primary call-to-action
  (`.btn-pill`, "Conferma prenotazione", "Prenota il ritiro"). Not for labels.
- **salvia** `#A2AE95` — soft secondary (cartoon-map parks, accents).
- **noce** `#6E4F33` — muted text. **bronzo** `#2A2620` — darkest ink.
- **Semantic (admin only):** success `emerald-600`, warning `amber-600`,
  error/`rosso` `red-600`, info `blue-600`.
- **Hierarchy rule:** gold = brand accent + labels + secondary actions;
  **rosso = the one primary action** on a screen. Never use rosso for labels.

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
  children); `scrollLeft`-driven hero frame scrub + masked Fraunces title; a
  scroll-driven horizontal parallax controller (`[data-px]`); GSAP map-pin drop
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
