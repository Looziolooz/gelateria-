# Artigiano Gelateria — demo (Pickup + CRM)

Sito demo di una gelateria artigianale costruito con **Next.js 16** (App Router, Turbopack), **Tailwind CSS v4**, shadcn/base-ui e **Lenis** (smooth scroll). Tutti i contenuti — brand, foto, testi — sono fittizi e a scopo dimostrativo.

Due funzionalità chiave:

1. **Pickup** — l'utente sceglie la gelateria, il giorno e l'orario di ritiro (slot generati dagli orari di apertura di ogni boutique), seleziona i gusti e il formato (cono / coppetta / vaschetta) e riceve una conferma.
2. **Admin / CRM** — area gestionale protetta da login con dati **interamente hardcoded** (demo): ordini, merce/magazzino, fatturato, prenotazioni, calendario.

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
| `/` | Home — hero scroll-driven, storia del brand, stili, anteprima boutique, mappa |
| `/pickup` | **Ordina e ritira** — gelateria + giorno + orario, gusti e formato, riepilogo e conferma |
| `/boutiques` | Le boutique del gusto (Milano + Roma) |
| `/stili-di-gelato` | Più di 50 storie di gusto — i pilastri del gelato |
| `/dove-trovarci` | Mappa illustrata e punti vendita |
| `/contact` | Form contatti + "Lavora con noi" |

## Area Admin / CRM

Accesso da **`/admin/login`** (le credenziali demo sono mostrate in pagina):

```
Email:    demo@artigiano.it
Password: artigiano2026
```

| Route | Contenuto |
|---|---|
| `/admin` | Dashboard — KPI, fatturato mensile, mix canali, gusti top, ordini recenti, avvisi scorta |
| `/admin/prenotazioni` | Prenotazioni pickup — stato, formato, gusti, KPI |
| `/admin/ordini` | Tabella ordini con ricerca e filtri di stato |
| `/admin/merce` | Magazzino — giacenze, scorte minime, stato |
| `/admin/fatturato` | Ricavi per mese e per boutique, scontrino medio, mix canali |
| `/admin/calendario` | Calendario con ritiri programmati ed eventi |

> L'autenticazione è solo dimostrativa (lato client, `sessionStorage`) e tutti i dati sono fittizi. Non inserire dati reali dietro questo login.

## Struttura

```
src/
  app/
    (site)/        # sito pubblico (header/footer, Lenis)
    admin/         # CRM (login + gate + shell con sidebar)
  components/      # SiteHeader, SiteFooter, PickupForm, admin/*
  lib/
    data.ts        # boutique, nav, stili, gusti, formati (sito)
    pickup.ts      # generazione slot orari
    admin-data.ts  # dati hardcoded del CRM
    admin-auth.ts  # login demo
public/            # immagini, font e icone
```
