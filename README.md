# iDevX-Space

Landing page for iDevX Space.

Built on the **iDevX platform standards**: the iDevX theme, brand marks, shared
UI components, `DESIGN-RULES.md`, ESLint rules and git hooks.

## Tech stack

- **React 18** + **TypeScript 5.6** (strict)
- **Vite 6**
- **Material UI 7** (Emotion) and **MUI X Data Grid 8** (Community)
- **Zustand 5** for state, **React Router 7** for routing
- **Tiptap 3** rich-text editor, **Apache ECharts 6**, **Notistack** snackbars
- **ESLint 9**, **Husky** + **lint-staged**

## Getting started

```bash
pnpm install
cp .env.example .env   # optional: change VITE_PORT
pnpm dev
```

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production build |

Pre-commit runs ESLint on staged files; pre-push runs `pnpm lint && pnpm build`.

## What's included

- **Landing page** at `/` — public, no sign-in and no navigation. Any other path
  redirects to it.
- **Shared components** in `src/components/` — the patterns listed in
  `DESIGN-RULES.md` §1 (app shell, list pages, data grid and cells, cards,
  fields, confirmation buttons, modals, history, notes, rich-text editor). They
  are kept for future pages; the authenticated shell (sidebar, bottom nav,
  helpdesk) is not mounted today.
- **Theme** in `src/utils/` (glassmorphic light and dark), **brand** in
  `src/constants/brand.ts` and `src/components/brand/`.

## Standards

Read **`DESIGN-RULES.md`** before building or changing any UI; `CLAUDE.md`
describes this repository's layout and conventions.

## Project structure

```
src/
  app/<feature>/     page.tsx (+ components/, columns.tsx)
  components/        shared components — everything in DESIGN-RULES §1
  constants/         shared values, brand palette, navigation
  hooks/             shared behaviour
  interfaces/        one file per domain entity
  providers/         theme provider
  stores/            one Zustand store per concern
  utils/             theme composition, formatting
```
