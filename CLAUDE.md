# Artigiano Gelateria — project notes

Demo site: storytelling gelateria + pickup ordering + hardcoded admin CRM.
Next.js 16 (App Router, Turbopack) · Tailwind v4 · React 19.

- Run: `npm run dev` (http://localhost:3000). Admin demo: `demo@artigiano.it` / `artigiano2026`.
- Public site lives under `src/app/(site)/`, admin under `src/app/admin/`.

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.
