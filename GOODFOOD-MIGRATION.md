# Brief per OpenCode — Migrazione design → "🍽️ Good Food"

> **Tu (OpenCode) NON conosci questo progetto.** Leggi questo file dall'inizio alla
> fine PRIMA di toccare qualsiasi cosa. Applica le modifiche **nell'ordine indicato**.
> Dopo OGNI sezione esegui la verifica (§9). Non improvvisare: i valori esatti sono qui.

---

## 0. Orientamento (leggi prima)

**Cos'è il progetto:** sito demo di una gelateria artigianale ("Artigiano Gelateria").
Stack: **Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · TypeScript**.
- Avvio: `npm run dev` (di solito porta 3000; se occupata usa un'altra — leggi l'output).
- Verifica completa: `npm run check` (= `eslint` + `tsc --noEmit` + `vitest run` + `next build`). **Deve restare verde.**
- Sito pubblico: `src/app/(site)/`. Admin/CRM: `src/app/admin/`.

**Come è fatto il design system (IMPORTANTISSIMO):** il sito usa **token CSS centralizzati**
e **classi font “ponte”**. Quasi tutti i colori/font derivano da variabili. Quindi la
strategia è: **cambiare i VALORI dei token e quale font alimenta ogni variabile**, così
l'intero sito cambia pelle modificando pochi file centrali. NON rinominare le variabili
o le classi (`.caviar`, `.core`, `.cormorant`, `--font-fraunces`, ecc.): cambia solo cosa
contengono.

**File centrali da cui parte tutto:**
- `src/app/globals.css` — blocco `@theme { --color-* }`, classi font `.caviar/.core/.cormorant`, helper (`.eyebrow`, `.btn-pill`, `.photo-grade`, `.grain`, `.figure-frame`…), `body`.
- `src/app/theme-utils.css` — `:root` con `--primary --secondary --background-1 --background-2 --black --white` e classi atomiche (`b-back-1`, `c-secondary`, …). **È minificato su una riga**: aprilo e modifica i valori esadecimali con find/replace mirato.
- `src/app/layout.tsx` — caricamento font via `next/font/google`.
- `next.config.ts` — `images.qualities`.
- `DESIGN.md` — documento di design (va aggiornato, §7).

### ⚠️ Trappole note (NON ripeterle)
1. **Cascata Tailwind v4:** le classi custom “unlayered” in `globals.css` (es. `.grain`, `.figure-frame`) **vincono** sulle utility Tailwind (che sono in `@layer utilities`). Perciò:
   - **NON** aggiungere `position` a `.grain` (romperebbe `position: sticky`/`fixed` degli elementi che la usano — hero e overlay).
   - **NON** aggiungere `border-radius` o `position` a classi usate insieme a utility Tailwind di pari proprietà.
2. **next/image `quality`:** ogni `quality={NN}` usato deve essere elencato in `next.config.ts → images.qualities`. Se aggiungi una quality nuova, aggiungila lì.
3. **Hero (`src/components/site/HeroSequence.tsx` + il pannello hero in `src/app/(site)/page.tsx`):** è una sequenza canvas “colata di cioccolato” sfumata nel panna. Se cambi lo sfondo, mantieni la **sfumatura crema “feather”** coerente col nuovo bg (vedi §4).
4. **Admin per-gelateria:** `src/lib/admin-data.ts` + `src/components/admin/AdminScope.tsx` + selettori `getOrders/getInventory/...`. **Non toccare la logica**, solo i colori (che cambiano da soli via token).
5. **Pickup è un wizard “controllato” a step obbligatori** (`src/components/PickupForm.tsx`). **Non** ripristinare lo scroll libero, **non** cambiare la logica di validazione; solo colori/font via token.
6. Non rinominare token/classi. Non rimuovere file. Non cambiare la struttura dei componenti se non indicato.

---

## 1. Obiettivo

Adottare il design system **🍽️ Good Food**: fotografia del cibo protagonista, calore
editoriale gourmand, palette di spezie/terre/mieli, **serif appetitosi**. Il sito è già
photo-first e caldo: questa è un'**evoluzione**, non una riscrittura. Si fa con due passaggi:
**(A) colori** e **(B) tipografia** a livello di token, poi rifiniture mirate (C–F).

### Mappa colori (la spina dorsale)
| Attuale (bottega) | → Nuovo (Good Food) | Ruolo |
|---|---|---|
| `#f6efe1` (panna) | `#F5EDD8` Parchment | background primario |
| `#e4d3b6` (mattone) | `#EDE0C4` Cream | superfici / card |
| `#efe3cc` (mattone chiaro) | `#F0E6CE` | superficie chiara |
| `#2c595e` (petrolio) | `#2E1A0E` Espresso | testo scuro + superfici scure |
| `#1f4348` (petrolio scuro) | `#1E110A` | scuro più profondo |
| `#2a2620` (bronzo/ink) | `#2E1A0E` Espresso | inchiostro |
| `#6e4f33` (noce/cocoa) | `#6B4F3A` | testo attenuato |
| `#ac7b40` (nocciola oro) | `#D4973A` Saffron | accento secondario / etichette |
| `#b23a2c` (rosso) | `#C1603A` Terracotta | **CTA primaria** / accento |
| `#a2ae95` (salvia) | `#7A8C6B` Sage | accento naturale |
| bordi/separatori | `#D8C4B2` Blush Linen | bordi |

### Mappa font
| Classe / variabile | Prima | Dopo (Good Food) |
|---|---|---|
| `.caviar` / `--font-fraunces` (display/titoli) | Fraunces | **Playfair Display** (usa anche italic) |
| `.core` / `--font-hanken` (body) | Hanken Grotesk | **Source Serif 4** |
| `.cormorant` / `--font-pinyon` (flourish "dal 1978") | Pinyon Script | **resta Pinyon Script** (tocco heritage, ok con Good Food) |
| **NUOVA** `.label` / `--font-label` (etichette uppercase) | — | **Libre Franklin** |

---

## 2. SEZIONE A — Colori (token)

### A.1 `src/app/globals.css` — blocco `@theme`
Trova il blocco e sostituisci SOLO i valori esadecimali (lascia i nomi variabili):
```css
@theme {
  --color-primary: #D4973A;     /* era #ac7b40 — Saffron (accenti/etichette) */
  --color-secondary: #2E1A0E;   /* era #2c595e — Espresso (scuri/testo) */
  --color-cream: #F5EDD8;        /* era #f6efe1 — Parchment (bg) */
  --color-gold: #EDE0C4;         /* era #e4d3b6 — Cream (superfici) */
  --color-gold-soft: #F0E6CE;    /* era #efe3cc */
  --color-ink: #2E1A0E;          /* era #2a2620 — Espresso */
  --color-cocoa: #6B4F3A;        /* era #6e4f33 — muted */
  --color-rosso: #C1603A;        /* era #b23a2c — Terracotta (CTA) */
  --color-salvia: #7A8C6B;       /* era #a2ae95 — Sage */
  --color-bottega-2: #1E110A;    /* era #1f4348 */
  --color-nocciola: #D4973A;     /* era #ac7b40 */
  --color-panna: #F5EDD8;        /* era #f6efe1 */
}
```
> Nota: i **nomi** restano (es. `--color-rosso`), cambia solo il valore. Tutte le classi
> `text-primary/bg-secondary/...` e gli atomici si aggiornano da soli.

### A.2 `src/app/globals.css` — blocco shadcn `:root`
Trova `:root { --background: #f6efe1; --foreground: #2c595e; --primary: #ac7b40; ... }` e porta a:
```css
:root {
  --background: #F5EDD8;
  --foreground: #2E1A0E;
  --primary: #C1603A;   /* terracotta come primario shadcn */
  --radius: 0.5rem;
}
```

### A.3 `src/app/theme-utils.css` — `:root`
Il file è minificato. Apri il file, individua le dichiarazioni e aggiorna i valori:
- `--background-1: #f6efe1` → `#F5EDD8`
- `--background-2: #e4d3b6` → `#EDE0C4`
- `--primary: #ac7b40` → `#D4973A`
- `--secondary: #2c595e` → `#2E1A0E`
- se presenti `--black`/`--white`/altri: `--black` resta scuro (`#2E1A0E` se era petrolio/bronzo), `--white`/`--cream` → `#F5EDD8`.
> Metodo sicuro: **find/replace dei singoli esadecimali** SOLO dentro `theme-utils.css`:
> `#f6efe1→#F5EDD8`, `#e4d3b6→#EDE0C4`, `#ac7b40→#D4973A`, `#2c595e→#2E1A0E`,
> `#b23a2c→#C1603A`, `#a2ae95→#7A8C6B`, `#6e4f33→#6B4F3A`, `#2a2620→#2E1A0E`, `#1f4348→#1E110A`.

### A.4 Esadecimali hardcoded nei componenti (pass mirato)
Valori **verificati** nei file (al momento della scrittura). Aggiorna SOLO questi:
- `src/app/(site)/page.tsx` — l'hero usa `bg-cream` (token → diventa Parchment **da solo**, non toccare). Ci sono **3 occorrenze di `#f6efe1`** (sfumature crema “feather”): cambiale tutte in **`#F5EDD8`**.
- `src/components/site/HeroSequence.tsx` — **nessun hex hardcoded** (usa classi/token). Non toccare.
- `src/components/site/ProcessScroll.tsx` — usa `var(--color-bottega-2)` / `var(--color-secondary)`: **già a posto via token**. Non toccare.
- `src/components/site/CartoonMap.tsx` — palette illustrativa. Gli hex presenti e la mappa esatta:
  - `#f3ead4` (base mappa) → **`#F5EDD8`**
  - `#b9c4a3` (parchi) → **`#7A8C6B`** (Sage)
  - `#9fc0c4` (fiume/acqua) → **`#9FB8B4`** (tenue, leggermente più caldo)
  - `#b9a07e` (griglia strade + blocchi, costante `INK_SOFT`) → **`#D8C4B2`** (Blush Linen)
  - `#6e4f33` (linee landmark, costante `INK`) → **`#6B4F3A`**
  - `#2c595e` (etichette + nome città, costante `PETROL`) → **`#2E1A0E`**
  - `#b23a2c` (coppetta pin) → **`#C1603A`** (Terracotta)
  - `#7d2419` (bordo coppetta) → **`#8A3A22`**
  - `#ac7b40` (pallina + cucchiaino) → **`#D4973A`** (Saffron)
  - `#e4d3b6` (pallina chiara) → **`#EDE0C4`**
  - `#f6efe1` (testo dentro la pill etichetta) → **`#F5EDD8`**
- **Controllo finale residui:** `grep -rniE "#(2c595e|b23a2c|ac7b40|f6efe1|e4d3b6|a2ae95|1f4348|2a2620|6e4f33|efe3cc|f3ead4|b9c4a3|b9a07e|9fc0c4|7d2419)" src` → ogni occorrenza rimasta va mappata (tranne dove già si usa `var(--color-…)`, che è corretto lasciare).

---

## 3. SEZIONE B — Tipografia (font)

### B.1 `src/app/layout.tsx`
Sostituisci import e dichiarazioni font (mantieni i **nomi delle variabili CSS** così il resto del sito non va toccato). **Aggiungi** Libre Franklin come `--font-label`:
```tsx
import { Playfair_Display, Source_Serif_4, Libre_Franklin, Pinyon_Script } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"], style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-fraunces", display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"], weight: ["400", "600"],
  variable: "--font-hanken", display: "swap",
});
const libre = Libre_Franklin({
  subsets: ["latin"], weight: ["500", "600"],
  variable: "--font-label", display: "swap",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"], weight: "400",
  variable: "--font-pinyon", display: "swap",
});
```
E aggiorna l'`<html className>` per includere tutte le variabili (incluso `--font-label`):
```tsx
<html lang="it" className={`${playfair.variable} ${sourceSerif.variable} ${libre.variable} ${pinyon.variable}`}>
```

### B.2 `src/app/globals.css` — classi font + fallback
Aggiorna gli stack di fallback (le variabili ora puntano ai nuovi font):
```css
.caviar    { font-family: var(--font-fraunces), "Playfair Display", Georgia, serif !important; }
.core      { font-family: var(--font-hanken), "Source Serif 4", Georgia, serif !important; }
.cormorant { font-family: var(--font-pinyon), "Pinyon Script", cursive !important; }
.label     { font-family: var(--font-label), "Libre Franklin", system-ui, sans-serif; }
```
Nel blocco `@theme` aggiorna i fallback dei font-token (i nomi restano):
```css
--font-caviar: var(--font-fraunces), "Playfair Display", Georgia, serif;
--font-core: var(--font-hanken), "Source Serif 4", Georgia, serif;
--font-cormorant: var(--font-pinyon), "Pinyon Script", cursive;
```
Nel `@layer base`, `body { font-family: ... }` → usa `var(--font-hanken), "Source Serif 4", Georgia, serif;`.

### B.3 Etichette uppercase → Libre Franklin
In `globals.css`, la classe `.eyebrow` (etichette uppercase con `letter-spacing`) deve usare Libre Franklin:
```css
.eyebrow {
  font-family: var(--font-label), "Libre Franklin", system-ui, sans-serif; /* era var(--font-core) */
  /* lascia invariato il resto: text-transform, letter-spacing, font-weight, size, color */
}
```
> Le altre micro-etichette usano `core t-u` inline e resteranno serif (Source Serif 4 maiuscolo): è accettabile (small-caps editoriali). NON serve toccarle.

---

## 4. SEZIONE C — Foto, texture, ombre

### C.1 Trattamento foto `.photo-grade` (in `globals.css`)
Good Food = foto “light & airy, cast warm”. Rendi la grade più calda e meno scura. Trova `.photo-grade::after` e sostituisci il `background` con:
```css
.photo-grade::after {
  content: "";
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  mix-blend-mode: multiply;
  background:
    radial-gradient(125% 125% at 50% 30%, transparent 60%, rgba(46,26,14,0.20) 100%),
    linear-gradient(180deg, rgba(212,151,58,0.08), rgba(193,96,58,0.08));
}
```
(meno vignetta, tinta miele/terracotta invece di petrolio).

### C.2 Grana “carta da forno” (`.grain` in `globals.css`)
Resta com'è (overlay 5% noise). **NON aggiungere `position`** a `.grain`. Va bene così.

### C.3 Ombre calde
Dove trovi ombre fredde/nere nei componenti card (es. `shadow-xl`, `rgba(0,0,0,…)`, `rgba(31,40,30,…)`), preferisci l'ombra calda Good Food. In `.figure-frame` (globals.css) cambia la `box-shadow` in:
```css
box-shadow:
  0 1px 0 rgba(245,237,216,0.5) inset,
  0 4px 24px rgba(46,26,14,0.10);
outline: 1px solid rgba(216,196,178,0.6); /* Blush Linen */
```

---

## 5. SEZIONE D — Componenti / CTA / dettagli

> Quasi tutto cambia da solo via token. Verifiche/rifiniture mirate:

- **CTA primaria** `.btn-pill` (globals.css): usa già `var(--color-rosso)` → ora Terracotta. ✅ Non toccare. Controlla solo che il radius resti morbido (Good Food ama `radius` piccolo: i pill `999px` vanno bene; per i bottoni squadrati Good Food usa `4px`, ma qui i pill sono ok — **non cambiare**).
- **Etichette/eyebrow:** già gestite in §B.3.
- **Hero title** (`HeroSequence.tsx`): il titolo `.caviar` ora è Playfair. Per il tono “recipe” puoi rendere il titolo **italic**: aggiungi la classe/utility `italic` allo `<h1>` dell'hero (opzionale, consigliato).
- **Numeri grandi** (es. numeri “01–04” negli stili/processo): già `.caviar` → Playfair, in Terracotta/Saffron via token. ✅
- **Bordi/separatori:** dove vedi `border-secondary/…` o hairline, ora derivano da Espresso; per i separatori sottili preferisci Blush Linen: nelle hairline `rule-gold` (globals.css) il gradiente usa `rgba(172,123,64,…)` → cambia in `rgba(212,151,58,…)` (Saffron) — opzionale.
- **Mappe `CartoonMap`:** vedi §A.4 (pin coppetta = Terracotta).

---

## 6. SEZIONE E — Admin / CRM

- I colori dell'admin (`src/app/admin/*`, `src/components/admin/*`) derivano dai token → **si aggiornano da soli**. La sidebar (`AdminShell.tsx`, `bg-secondary`) diventa Espresso, gli accenti diventano Terracotta/Saffron.
- **Leggibilità tabelle:** se il body serif (Source Serif 4) rende le tabelle admin pesanti, applica Libre Franklin alle tabelle: nei file `src/components/admin/OrdersTable.tsx`, `InventoryTable.tsx`, `ui.tsx` aggiungi la classe `label` (`.label`) al `<table>` o ai container. **Opzionale**, fallo solo se la verifica visiva lo richiede.
- **NON** modificare la logica: scope per-gelateria, selettori, `useSyncExternalStore`, login demo. Solo aspetto.

---

## 7. SEZIONE F — Aggiorna `DESIGN.md`

Aggiorna le sezioni del documento per riflettere Good Food (senza cancellare lo storico “Decisions Log”, aggiungi una riga):
- **Aesthetic Direction:** da “warm bottega/heritage” a “**Good Food — editoriale gourmand, foto-first, serif appetitosi, toni di spezie/terra/miele**”.
- **Typography:** Display = **Playfair Display** (italic per i titoli), Body = **Source Serif 4**, Label = **Libre Franklin**, Flourish = Pinyon Script.
- **Color:** sostituisci i nomi/hex con: Parchment `#F5EDD8`, Cream `#EDE0C4`, Terracotta `#C1603A` (CTA primaria), Saffron `#D4973A` (accento/label), Espresso `#2E1A0E` (testo/scuri), Sage `#7A8C6B`, Blush Linen `#D8C4B2`. Regola gerarchia: **Terracotta = unica azione primaria** per schermata; Saffron = accento/etichette.
- **Decisions Log:** aggiungi riga con data odierna: “Adottato design system **Good Food** (vault) — remap token colori + font su Playfair/Source Serif 4/Libre Franklin; petrolio→espresso, rosso→terracotta, oro→saffron”.

---

## 8. SEZIONE G — Cosa NON fare (guardrail)

- ❌ Non rinominare variabili/classi (`--font-fraunces`, `.caviar`, `--color-rosso`, …).
- ❌ Non aggiungere `position`/`border-radius` a `.grain`/`.figure-frame` o ad altre classi custom usate con utility Tailwind.
- ❌ Non introdurre blu/viola/azzurri (Good Food: “mai freddo nel food”). L'unico semi-freddo ammesso è il Sage e l'acqua tenue della mappa.
- ❌ Non usare bianco puro `#fff` come sfondo di sezione (usa Parchment/Cream).
- ❌ Non toccare: logica admin per-gelateria, wizard pickup gated, sequenza canvas hero, scroll orizzontale.
- ❌ Non cambiare `next.config.ts` se non per aggiungere eventuali nuove `images.qualities`.
- ✅ Mantieni accessibilità: contrasto testo Espresso su Parchment è ok; verifica che Saffron NON sia usato come testo piccolo su Parchment (poco contrasto) — per testo piccolo usa Espresso/cocoa.

---

## 9. Verifica (esegui dopo OGNI sezione e alla fine)

1. **Build/lint/test:**
   ```
   npm run check
   ```
   Deve finire **verde** (eslint 0 errori, tsc 0 errori, vitest 22 test passati, next build ok).
   - Se `tsc` lamenta font: hai cambiato un import di `next/font/google` con un nome non valido. I nomi corretti: `Playfair_Display`, `Source_Serif_4`, `Libre_Franklin`, `Pinyon_Script`.
   - Se compare warning `images.qualities`: aggiungi la quality mancante in `next.config.ts`.
2. **Verifica visiva** (`npm run dev`, poi apri il browser sulla porta indicata):
   - Home: hero crema con titolo Playfair (italic), CTA **Terracotta**, sfumatura coerente.
   - Sezioni scure (processo, footer, overlay menu, sidebar admin): ora **Espresso** (marrone caldo), non più petrolio.
   - Etichette uppercase in **Libre Franklin**; titoli/numeri in **Playfair**; testo in **Source Serif 4**.
   - Mappe città (`/dove-trovarci`): pin coppetta **Terracotta**, toni caldi.
   - `/pickup`: il wizard funziona ancora a step obbligatori (non saltabile).
   - `/admin/login` → “Entra nella demo” → dashboard con accenti Terracotta/Saffron, switcher gelateria funzionante.
3. **Reduced motion / responsive:** controlla 375px e desktop; nessun overflow orizzontale rotto.

---

## 10. Ordine di esecuzione consigliato
1. §2 (colori token: A.1→A.4) → `npm run check` → verifica visiva.
2. §3 (font: B.1→B.3) → `npm run check` → verifica visiva.
3. §4 (foto/texture/ombre) → verifica visiva.
4. §5 (rifiniture componenti) → verifica.
5. §6 (admin, solo se serve) → verifica.
6. §7 (`DESIGN.md`).
7. §9 verifica finale completa. Non lasciare `npm run check` rosso.

---

Fine brief.
