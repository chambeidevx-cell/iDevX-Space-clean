# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## MANDATORY: read DESIGN-RULES.md first

> This section is the shared standard across our platforms. Copy it verbatim
> into every project's `CLAUDE.md`; only the sections below it are per-repo.

**Before building or changing any page, feature, component, or UI behaviour,
read [`DESIGN-RULES.md`](./DESIGN-RULES.md) — in full, at the start of the task,
before writing code or proposing a plan.** It is not reference material to
consult when something looks unfamiliar; it is the specification the work is
measured against.

This applies to new pages, new features, edits to existing screens, styling
changes, and anything touching tables, cards, navigation, forms, modals, or
confirmations. There is no change small enough to skip it — a one-line styling
tweak is exactly how a divergent pattern gets in.

### The required order of work

1. **Read `DESIGN-RULES.md` first — before any other tool call, every task.**
   Start with §1, the component inventory. Reading it is not conditional on the
   change looking large, unfamiliar, or UI-heavy. Having read it in a previous
   task does not count: read it again, because it changes.

   Then, before writing code, **name the sections that govern this change** —
   e.g. "§1 for the inventory, §4 for table rules, §15 for the list-page
   checklist". One line is enough. This is how the rule stays checkable instead
   of assumed; if you cannot name the governing sections, you have not read
   enough of the document to start.
2. **Search for an existing component before writing one.** If §1 lists what you
   need, import it. If the project is missing it, port it from a platform that
   has it — keep the name, path and props identical. Never re-implement a listed
   pattern inline.
3. **Follow the relevant section** for the thing you are building — §15 is the
   checklist for a list page.
4. **When the work produces something the rules should carry, judge whether to
   write it or raise it — but never let it go unrecorded.** Most development
   turns up something worth keeping: a constraint discovered the hard way, a
   trap in a shared component, a decision that will otherwise be re-litigated.

   **Write it in yourself** when it records what was just done rather than
   committing anyone to anything new:

   - a trap or constraint found while working — the reason a thing had to be
     built the way it was;
   - a rule for a shared component whose behaviour you changed, which is
     required anyway (see 5);
   - a small extension, correction or clarification of a rule that already
     exists.

   **Stop and ask** when the entry commits other people or other platforms:

   - adding a component to §1, which tells every platform to adopt or port it;
   - reversing or narrowing a rule that already exists, as opposed to sharpening
     it — someone built to the old wording;
   - anything implying work elsewhere: a refactor, a migration, a convention
     other projects must follow;
   - a genuine choice between two defensible rules, where you would be picking
     rather than recording.

   When in doubt, write it and say clearly that you did, so it can be reverted
   in one edit. Silence is the only wrong answer: a decision taken and not
   written down is one the next person pays for.
5. **If you change the design or behaviour of a shared component, update its
   rule in `DESIGN-RULES.md` in the same change.** The component and its rule
   are one unit. A change that leaves them disagreeing is unfinished — the next
   person follows the rule, rebuilds the old behaviour, and the platforms drift
   apart again. This applies to visual changes as much as structural ones:
   colours, sizes, spacing, ordering, defaults.

   This one is not gated — leaving the code and its rule disagreeing is the
   drift the document exists to prevent, so never wait for approval to keep them
   in step. But **say plainly in your report that `DESIGN-RULES.md` changed and
   what the new wording is**, because the change now applies to every platform
   and someone has to push it to the other repos.
6. **Report any rule you could not follow**, and why. Silent deviation is worse
   than a flagged exception.

### Precedence

Where this file and `DESIGN-RULES.md` disagree, **`DESIGN-RULES.md` wins** — it
is the cross-platform standard, and this file only describes one repository.
Anything reusable you create belongs in `DESIGN-RULES.md`, not here, so the
other platforms inherit it.

---

The sections below are specific to **this** repository.

## Origin

**iDevX Space** follows the shared iDevX platform standards: the theme, brand
marks, shared components, `DESIGN-RULES.md`, lint rules and git hooks. The
shared components keep the same names, paths and props as on the other
platforms (`DESIGN-RULES.md` §1).

Today the app is a single public landing page. The shared components, stores and
constants — including the authenticated shell (`BaseLayout`, `Sidebar`,
`MobileBottomNav`, `ProtectedRoute`, `auth-store`) — are kept in the repo but
are not mounted, ready for when the app grows real pages.

## Commands

```bash
pnpm dev        # Vite dev server (port from VITE_PORT, default 5173)
pnpm build      # tsc -b && vite build — type-checks, so treat it as the gate
pnpm lint       # ESLint across the codebase
pnpm preview    # Preview the production build
```

No test runner is configured. Husky runs `lint-staged` (ESLint on staged files)
on pre-commit, and `pnpm lint && pnpm build` on pre-push — so both must be clean
before anything can be pushed.

## Architecture

React 18 + TypeScript + Vite, Material UI 7, Zustand, React Router 7.

### Path alias

`@/` maps to `./src/`. Use it for all internal imports
(`import { useAuthStore } from '@/stores/auth-store'`).

### Routing — `src/app.tsx`

`BrowserRouter`. There is no sign-in: every route is public. Page components
live at `src/app/<feature>/page.tsx` and are lazily imported
(`DESIGN-RULES.md` §11).

| Route | Page |
|---|---|
| `/` | Landing page — standalone, no sidebar or navigation |
| `*` | Redirects to `/` |

To add a page behind the app shell: create `src/app/<feature>/page.tsx`, nest a
lazy route under a `<BaseLayout>` route in `app.tsx` (wrapped in
`<ProtectedRoute>` once there is a login page again), add its nav entry to
`MENU_ITEMS` in `src/constants/navigation.tsx`, and add its path to
`MOBILE_ALLOWED_PATHS` only if it has a responsive layout.

### Layouts

The landing page (`src/app/home/page.tsx`) is its own full-viewport layout: the
`ProductLockup` at the top, the content, and `AppAttribution` at the foot, with
the content gutters and safe-area insets from `constants/layout.ts`.

`<BaseLayout>` (`src/components/base-layout.tsx`) is retained but not mounted. It
renders the sidebar, the content area, the footer, and the mobile bottom
navigation, and mounts the helpdesk modal
(`src/components/modals/helpdesk-modal.tsx`) lazily, on demand.

- The page scroll container is the `overflowY: 'auto'` Box inside `BaseLayout` —
  that is what `PageActionBar` sticks against.
- `BaseLayout` gates mobile access: a path outside `MOBILE_ALLOWED_PATHS`
  renders `<DesktopOnlyNotice />` instead of the page.

### State — `src/stores/`

One Zustand store per concern. All persist to `localStorage` via the `persist`
middleware except `theme-store` and `user-store`; `user-store` manages its own
`user-info` key directly.

| Store | Responsibility |
|---|---|
| `auth-store` | Login/logout, `isAuthenticated` (mock credentials for now) |
| `user-store` | Current user profile |
| `theme-store` | Light/dark mode |
| `sidebar-store` | Sidebar collapsed state |
| `filters-visibility-store` | Filter panel shown or hidden |
| `name-format-store` | Display format for people's names |
| `my-company-store` | Company profile shown in the sidebar and identity card |
| `maintenance-store` | Active / scheduled maintenance, read by `MaintenanceBanner` |

Add new global state as a new store file. Never merge unrelated concerns into an
existing one.

### Theming — `src/utils/`, `src/providers/`

`src/utils/theme.ts` composes `light-theme.ts` and `dark-theme.ts`.
`ThemeProvider` reads `theme-store` and passes the active theme to MUI. Use
`useTheme` from `src/hooks/use-theme.ts` for the current mode. The font is
Plus Jakarta Sans, loaded in `index.html`.

Both themes are glassmorphic — translucent surfaces over a fixed gradient body.
A component that must hide what is behind it therefore needs an explicitly
opaque background; the translucent default will not occlude.

### Brand — `src/constants/brand.ts`, `src/components/brand/`, `public/`

- **`brand.ts` holds the logo and wordmark palette** (`IDEVX_SPACE_PALETTE`,
  `IDEVX_SPACE_WORDMARK_GRADIENT`, `IDEVX_WORDMARK_GRADIENT`,
  `IDEVX_WORDMARK_INK`), the logo paths, and `COMPANY_NAME`. These are brand
  colours: identical in both themes, and never swapped for theme tokens. The
  theme's `primary.main` is iDevX orange and belongs to the interface, not the
  product mark. The product's name is `IDEVX_SPACE_PLATFORM_NAME` in
  `constants/app.ts`.
- `ProductLockup`, `CompanyMark`, `MobileBrandHeader` and `AppAttribution`
  render the marks. The product lockup reads **iDevX Space** with the iDevX logo
  (`IDEVX_SPACE_LOGO`) — when the product gets a mark of its own, change it in
  `brand.ts` and nowhere else.
- Logos live in `public/`: `idevx-new-logo.png` (also the favicon) and
  `idevx.png`.

### Interfaces and constants

- Domain types in `src/interfaces/`, one file per entity.
- Shared values in `src/constants/`. Notably `data-grid.ts` (column widths,
  filter sizing), `entity-ids.ts` (display ID prefixes and padding),
  `navigation.tsx` (nav tree, mobile allow-list, breakpoint), `date-time.ts`
  (display timezone), `name-format.ts` (name tokens), `layout.ts` (gutters,
  safe-area insets), `typography.ts` (the monospace face for identifiers and
  money).

### Notifications

`notistack` `<SnackbarProvider>` is configured in `app.tsx` with a custom
`AlertSnackbar`, a 1-snack limit, 6 s auto-hide, anchored top-centre. Use
`useSnackbar()` to enqueue.

## ESLint rules worth knowing

- 2-space indent, single quotes, semicolons required.
- `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps` enforced.
- **No unused variables** — and `tsc` is strict about unused imports too, so
  removing the last use of an import breaks the build until the import goes.

## Working notes

- `pnpm build` is the real check: it runs `tsc -b` first, so type errors surface
  there rather than in `pnpm lint`.
- The data grid is the **Community** (free) package. Pro-only features —
  column pinning, row grouping, tree data — are not available; see
  `DESIGN-RULES.md` §4 for how pinning is implemented instead.
- There is no backend yet: auth and the user/company profiles are mock data in
  their stores. Treat them as stand-ins for an API.
- `MaintenanceBanner` and the sidebar badge link to `/platform-management`,
  which does not exist here. Nothing in this project starts a maintenance, so
  the banner never shows; point the link at this project's own maintenance page
  if one is added.
