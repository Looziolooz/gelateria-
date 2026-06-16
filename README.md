# CREMA | Alta Gelateria — clone + Pickup + CRM

Clone ad alta fedeltà di [gelatocrema.com](https://gelatocrema.com/) costruito con **Next.js 16** (App Router, Turbopack), **Tailwind CSS v4**, shadcn/base-ui e **Lenis** (smooth scroll). Font, immagini, palette e contenuti sono estratti dal sito originale.

Due personalizzazioni rispetto all'originale:

1. **Pickup al posto del Delivery** — la voce "Delivery" è sostituita da **Pickup**: l'utente sceglie la gelateria, il giorno e l'orario di ritiro (slot generati dagli orari di apertura reali di ogni boutique) e riceve una conferma.
2. **Admin / CRM** — area gestionale protetta da login con dati **interamente hardcoded** (demo): ordini, merce/magazzino, fatturato, calendario.

## Avvio

```bash
npm install        # le dipendenze sono già presenti in node_modules
npm run dev        # http://localhost:3000
# build di produzione
npm run build && npm run start
```

## Pagine pubbliche

| Route | Descrizione |
|---|---|
| `/` | Home — hero, storia del brand, stili, anteprima boutique, sezione pickup |
| `/pickup` | **Ordina e ritira** — selezione gelateria + giorno + orario, riepilogo e conferma |
| `/boutiques` | Le boutique del gusto (5 sedi, Milano + Roma) |
| `/stili-di-gelato` | Più di 50 storie di gusto — i 5 pilastri |
| `/dove-trovarci` | Mappe e punti vendita |
| `/contact` | Form contatti + "Lavora con noi" |

## Area Admin / CRM

Accesso da **`/admin/login`** (le credenziali sono mostrate in pagina):

```
Email:    demo@crema.it
Password: crema2026
```

| Route | Contenuto |
|---|---|
| `/admin` | Dashboard — KPI, fatturato mensile, mix canali, gusti top, ordini recenti, avvisi scorta |
| `/admin/ordini` | Tabella ordini con ricerca e filtri di stato (include ordini Pickup) |
| `/admin/merce` | Magazzino — giacenze, scorte minime, stato (disponibile / in esaurimento / esaurito) |
| `/admin/fatturato` | Ricavi per mese e per boutique, scontrino medio, mix canali |
| `/admin/calendario` | Calendario giugno 2026 con ritiri programmati ed eventi |

> L'autenticazione è solo dimostrativa (lato client, `sessionStorage`) e tutti i dati sono fittizi.

## Struttura

```
src/
  app/
    (site)/        # sito pubblico (header/footer, Lenis)
    admin/         # CRM (login + gate + shell con sidebar)
  components/      # SiteHeader, SiteFooter, PickupForm, admin/*
  lib/
    data.ts        # boutique, nav, stili, social (sito)
    pickup.ts      # generazione slot orari
    admin-data.ts  # dati hardcoded del CRM
    admin-auth.ts  # login demo
public/            # immagini, font e icone reali del sito originale
docs/research/     # artefatti di estrazione (HTML/CSS originali)
```

Asset originali scaricati con `node scripts/download-assets.mjs`.
