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
- **Approach:** hybrid — creative-editorial storytelling for the public site,
  grid-disciplined for the admin dashboard.
- **Homepage (desktop ≥1024px):** horizontal scroll engine
  (`components/site/HorizontalScroll.tsx`) — full-screen panels in a row, vertical
  wheel mapped to horizontal; the hero pins (sticky, 2-viewport section) and
  scrubs 40 frames. **Mobile/tablet (<1024px):** panels stack vertically.
- **Single-screen pages:** dove-trovarci, contact (2-col → stacked on mobile).
- **Border radius:** chips/pills `999px`; cards `14–18px`; inputs `10px`.

## Motion
- **Approach:** intentional. Reveal-on-scroll (`[data-reveal]`, fade-up 0.9s
  `cubic-bezier(.22,.61,.36,1)`); pinned hero frame scrub; gold slider scrollbar
  (`.h-scroll`); horizontal-scroll lerp (0.12). Respects `prefers-reduced-motion`.

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
