# Platform Design Rules

The shared UI/UX standard for our platforms. Copy this file into a new project's
repo root and follow it there.

**This document is portable by design.** It describes patterns, not one
product's screens. Nothing below names a specific platform, page or entity —
where an example is needed it is written generically, so the same rules read
correctly whether the project manages employees, clients, invoices or anything
else.

## When to read this

**At the start of every feature, page, component, or UI change — before writing
code or proposing a plan.** Not when something looks unfamiliar; every time.
New pages, edits to existing screens, styling tweaks, and anything touching
tables, cards, navigation, forms, modals or confirmations all qualify. A
one-line styling change is exactly how a divergent pattern gets in.

The rule that governs all the others: **look for an existing component before
writing a new one.** Duplication is the failure mode this document exists to
prevent. If a pattern appears in two features, it belongs in `components/`.

**KISS and DRY apply to every change, without exception** — not only to new
features, and not only when there is time. They are set out in full in §10 and
they outrank every other rule here; where something below seems to conflict with
them, they win.

The cost of ignoring them is not abstract. Nearly every revision in this
document's history exists because the same thing was built twice: two sticky
bars that scrolled differently, two cards showing the same person, two search
fields sizing themselves by different rules. Each had to be found, compared and
merged later, at several times the cost of sharing it at the outset. Build it
once, in the simplest form that answers the actual requirement, and put it where
the second caller will find it.

Before writing code, **name the sections that govern the change** — one line,
e.g. "§1 for the inventory, §4 for table rules". If you cannot name them, you
have not read enough of this document to start.

If a pattern you need is genuinely absent from §1, **say so rather than quietly
inventing one.** Whether you then add it here yourself or raise it first depends
on what the entry commits:

- **Write it in** when it records what was just done — a constraint found the
  hard way, a trap in a component you changed, a correction or clarification of
  a rule that already exists. These cost nothing to revert and everything to
  lose.
- **Ask first** when the entry commits other people: adding a component to §1,
  which tells every platform to adopt or port it; reversing or narrowing an
  existing rule, which someone has already built to; anything implying a
  refactor or migration elsewhere; or a real choice between two defensible rules
  where you would be picking rather than recording.

When in doubt, write it and say clearly that you did, so it can be taken out in
one edit. **Silence is the only wrong answer.** A decision taken and never
written down is one the next person pays for — and this document exists because
that has happened often enough to be the expensive habit, not the cautious one.

Report any rule you could not follow and why; a flagged exception is fine,
silent deviation is not.

## Keeping this current

**This document and the shared components are one unit. Changing either without
the other leaves the standard broken.**

- **Change a shared component's design or behaviour → update its rule here, in
  the same change.** Colours, sizes, spacing, ordering, defaults and structure
  all count, not just large rewrites.
- **Add a reusable component → ask first, then add it to §1** and write the rule
  that governs it, so the next project inherits the component *and* the
  reasoning. This is the one entry that is always raised rather than written
  in: §1 tells every platform to adopt or port what it lists.
- **Where the code and this document disagree, that is a bug**, not a detail.
  Fix whichever is wrong and say which you changed.

Keeping an existing rule in step with its component is the one edit here that is
**not** gated on asking — code and rule disagreeing is the whole failure this
prevents, so never wait for approval to fix it. Say clearly that this document
changed, and what the new wording is, so it can be pushed to the other repos.

The failure this prevents is quiet and slow: someone reads a rule describing
behaviour the component no longer has, builds to the rule, and the platforms
drift apart one screen at a time. A rule nobody maintains is worse than no rule,
because it is trusted.

When a rule changes, it changes for every platform. Push the updated document to
the other repos rather than letting each carry its own version.

## How to use this in an existing project

Bringing a codebase that already exists into line with this document. Work in
this order — it finds the expensive problems first, and keeps the diff
reviewable.

1. **Read the whole document before changing anything.** An audit done section
   by section produces a hundred small edits that contradict each other.
2. **Inventory first (§1).** For every component listed, find the project's
   equivalent. Record which of these it is: present at the documented path;
   present under a different name or path; present but re-implemented inline in
   one or more pages; missing; or genuinely not applicable here. This table is
   the plan — everything else follows from it.
3. **Find the duplicates (§10).** Search for the same pattern built twice:
   two components doing one job, a value repeated across files, a page
   re-implementing something `components/` already has. These are the findings
   that matter most, because every day they stay unmerged they drift further.
4. **Then check behaviour against the rules**, section by section, for what the
   project actually has — tables against §4, dates against §6, confirmations
   against §7, and so on.
5. **Report before refactoring.** Produce the findings as a list: what breaks
   which rule, where, and what the fix is. Agree the list, then change code.
   A sweeping conformance refactor delivered unannounced is unreviewable and
   usually contains two or three decisions nobody would have agreed to.
6. **Change code in rule-sized commits**, not one. "Adopt `AppDataGrid`
   everywhere" is a commit; "conform to DESIGN-RULES" is not.

Two things to be careful of while auditing:

- **A rule this document does not cover is not a violation.** Projects differ.
  Flag the gap rather than inventing a rule to enforce.
- **Where the code is right and the document is wrong, say so.** This file is
  maintained, not handed down; a rule describing behaviour no one wants is a bug
  in the rule.

## How to use this in a new project

1. Copy this file to the repo root, and copy the "read this first" rule into the
   project's `CLAUDE.md` so it is loaded automatically every session.
2. Read §1. For each pattern, check whether the project already has the
   component. Some projects will have all of them, a new project none.
3. **Missing components get ported, not re-implemented inline.** Copy the
   component from a project that has it, keep the name, path and props
   identical, and update §1.
4. Anything you need that is not in §1: **raise it before adding it to §1** —
   that holds from the first task in a new project, not only in established
   ones, because §1 is what the other projects read to know what to port. Once
   agreed, make it shared, document it, add it to §1, and push the update back.
   Everything else you learn along the way — traps, constraints, corrections —
   write in as you go.

---

## 1. Component inventory

The standard set. Paths are conventional — keep them identical across projects
so the same import works everywhere.

### Page shells

| Component | Path | Responsibility |
|---|---|---|
| `BaseLayout` | `components/base-layout.tsx` | Navigation + content shell for authenticated routes |
| `FullHeightPage` | `components/full-height-page.tsx` | Pages that fill the viewport and scroll their content internally |
| `StickySurface` | `components/sticky-surface.tsx` | A bar that stays in reach while the page scrolls, and frosts once it detaches |
| `PageActionBar` | `components/list-page/page-action-bar.tsx` | Sticky container for a page's actions |
| `DesktopOnlyNotice` | `components/desktop-only-notice.tsx` | Shown when a desktop-only page is opened on mobile |
| `PageLoader` | `components/page-loader.tsx` | Suspense fallback while a lazy page loads |
| `InfoPanel` | `components/info-panel.tsx` | A block set apart from the page: tinted, accent bar, severity colour |
| `MobileBottomNav` | `components/mobile-bottom-nav.tsx` | Floating bottom navigation on mobile and tablet; "More" opens the full tree |
| `FloatingCornerActions` | `components/floating-corner-actions.tsx` | The buttons pinned to the bottom-right corner on mobile: helpdesk, back-to-top |
| `PageHeader` | `components/page-header.tsx` | The page's name, on tablet and below |
| `MaintenanceBanner` | `components/maintenance-banner.tsx` | Estate-wide band: a deployment running or booked |
| `AppAttribution` | `components/brand/app-attribution.tsx` | The footer line — build version and "Powered by" mark (§3); the caller decides where it sits |

### List pages

| Component | Path | Responsibility |
|---|---|---|
| `ListPageToolbar` | `components/list-page/list-page-toolbar.tsx` | Primary action + search + filters + columns + export |
| `FiltersPanel` | `components/list-page/filters-panel.tsx` | Filter panel beside the list |
| `FilterSelect` | `components/list-page/filter-select.tsx` | A select inside the filter panel |
| `FilterMultiSelect` | `components/list-page/filter-multi-select.tsx` | A filter accepting several values, as checkboxes |
| `ListPageContent` | `components/list-page/list-page-content.tsx` | Splits a list page into list + filters |
| `ResponsiveListView` | `components/list-page/responsive-list-view.tsx` | Table on desktop, cards on mobile |
| `AppDataGrid` | `components/data-grid/app-data-grid.tsx` | Every table. Never use the raw `DataGrid` |
| `SearchField` | `components/data-grid/search-field.tsx` | Search input with clear |
| `SectionSearchBar` | `components/section-search-bar.tsx` | Filters a record page down to matching sections |
| `ToolbarIconButton` | `components/data-grid/toolbar-icon-button.tsx` | Outlined toolbar icon button |
| `ColumnVisibilityPopover` | `components/data-grid/column-visibility-popover.tsx` | Column management |
| `ExportButton` | `components/actions/export-button.tsx` | Export |

### Grid cells

| Component | Path | Responsibility |
|---|---|---|
| `HoverActionCell` | `components/data-grid/cells/hover-action-cell.tsx` | Base for any cell with hover actions |
| `CopyCell` | `components/data-grid/cells/copy-cell.tsx` | Copyable value |
| `EmailCell` | `components/data-grid/cells/email-cell.tsx` | Email address |
| `LinkCell` | `components/data-grid/cells/link-cell.tsx` | URL |
| `CellIconButton` | `components/data-grid/cells/cell-icon-button.tsx` | Icon button inside a cell |
| `RowActionsMenu` | `components/data-grid/row-actions-menu.tsx` | The row's `⋮` overflow menu |
| `ChipListCell` | `components/data-grid/cells/chip-list-cell.tsx` | Multi-value field, with "+N" overflow |
| `NumberCell` | `components/data-grid/cells/number-cell.tsx` | Numeric value |
| `CurrencyCell` | `components/data-grid/cells/currency-cell.tsx` | Money, in ledger layout |
| `StatusChip` / `StatusChipCell` | `components/data-grid/status-chip.tsx` | Any status value |
| `PersonNameCell` | `components/data-grid/cells/person-name-cell.tsx` | A person's name, in the configured format |
| `ActorDateCell` | `components/data-grid/cells/actor-date-cell.tsx` | Who did it and when, stacked |
| `SelectCell` | `components/data-grid/cells/select-cell.tsx` | A chip the operator sets in place |

### Mobile cards

| Component | Path | Responsibility |
|---|---|---|
| `EntityCard` | `components/cards/entity-card.tsx` | Mobile stand-in for a table row |
| `UserIdentityCard` | `components/cards/user-identity-card.tsx` | Who the signed-in person is: avatar, name, company, roles, addresses |
| `StatCard` | `components/cards/stat-card.tsx` | A headline figure on a dashboard |
| `PlatformCard` | `components/cards/platform-card.tsx` | A platform as a tile — mark, name, and a colour the caller decides |
| `PanelCard` / `PanelRow` | `components/cards/panel-card.tsx` | A titled dashboard panel and its list rows |
| `BreakdownList` | `components/charts/breakdown-list.tsx` | Labelled rows with proportional bars |
| `MiniBarChart` | `components/charts/mini-bar-chart.tsx` | A short series, without a charting library |
| `CardField` | `components/fields/card-field.tsx` | Label/value row inside a card |
| `EmailField` | `components/fields/email-field.tsx` | Email row with send / open / copy |
| `ContactNumberField` | `components/fields/contact-number-field.tsx` | Phone row with call / copy |
| `ContactChip` | `components/fields/contact-chip.tsx` | A contact detail as a chip, with copy and an optional action |
| `CopyAdornment` | `components/fields/copy-adornment.tsx` | Copy button at the end of a text field |
| `EmailChip` | `components/fields/email-chip.tsx` | An address as a chip: email options, plus copy |
| `EmailOptionsMenu` | `components/modals/email-options-menu.tsx` | The choice between the in-app composer and the reader's mail client |
| `MoneyField` | `components/fields/money-field.tsx` | Monetary amount in a card or detail panel |
| `PlatformMark` | `components/platforms/platform-mark.tsx` | A platform's logo, or its icon in the platform's colour |

### Confirmation and input

| Component | Path | Responsibility |
|---|---|---|
| `WithPassword` | `components/buttons/with-password.tsx` | Destructive or privileged actions |
| `WithReason` | `components/buttons/with-reason.tsx` | Reversible actions needing an audit trail |
| `WithPopover` | `components/buttons/with-popover.tsx` | Plain yes/no confirmation |
| `CancelButton` | `components/buttons/cancel-button.tsx` | The back-out half of any button pair |
| `CurrencyField` | `components/fields/currency-field.tsx` | Monetary amount input |
| `DialCodeField` | `components/forms/dial-code-field.tsx` | Country dial code, beside a number field |
| Entity field groups | `components/forms/` | The fields that make one record (e.g. `ClientFields`) |
| `RichTextEditor` | `components/editor/rich-text-editor.tsx` | Any rich-text input |
| `RichTextContent` | `components/editor/rich-text-content.tsx` | Rendering stored rich text |
| `ModalHeader` / `DialogCloseButton` | `components/modals/` | Dialog headers |
| `HistoryDialog` / `HistoryEntryList` | `components/history/` | Audit and history views (§8) |
| `NotesDialog` / `NoteList` | `components/notes/` | Notes left on a record (§8) |

### Hooks

| Hook | Path | Responsibility |
|---|---|---|
| `useIsMobile` | `hooks/use-is-mobile.ts` | The single mobile breakpoint check |
| `useFiltersVisibility` | `hooks/use-filters-visibility.ts` | Filter panel open state |
| `useCopyToClipboard` | `hooks/use-copy-to-clipboard.ts` | Copy with "Copied!" feedback |
| `useIsTruncated` | `hooks/use-is-truncated.ts` | Whether text is cut off, for a tooltip that only appears when it is |
| `useTheme` | `hooks/use-theme.ts` | Active theme mode |

### Configuration

| Module | Path | Holds |
|---|---|---|
| `COLUMN_MIN_WIDTH`, `FILTER_FIELD_SX` | `constants/data-grid.ts` | Table and filter sizing |
| `ENTITY_ID_FORMATS`, `formatEntityId` | `constants/entity-ids.ts` | Display identifier prefixes and padding |
| `formatNumber`, `formatCount`, `formatCurrency`, `getCurrencyDecimals` | `utils/format-number.ts` | Number and money formatting |
| `APP_TIME_ZONE`, `APP_DATE_LOCALE` | `constants/date-time.ts` | Display timezone and locale (§6) |
| `formatDate`, `formatDateTime`, `toDateInputValue` | `utils/format-date.ts` | Date and time formatting |
| `MOBILE_ALLOWED_PATHS`, nav tree | `constants/navigation.tsx` | Navigation and mobile gating |
| `CONTENT_GUTTER_SX`, `SAFE_AREA_*` | `constants/layout.ts` | Page gutters, footer band, and the device safe-area insets (§3) |
| `STATUS_COLORS` | `components/data-grid/status-chip.tsx` | Status → colour mapping |
| `DASHBOARD_ACCENTS` | `constants/dashboard-accents.ts` | Card accents — one use per page, never a theme colour |
| `PLATFORMS` | `constants/platforms.ts` | Per-platform identity colour, at accent vibrancy |

---

## 2. The sticky page action bar

**A page's actions must stay reachable while its content scrolls.** Search,
filters and the primary button are most useful partway down a long list, which
is exactly when an unpinned bar has scrolled out of reach.

Every page with a toolbar wraps it in `PageActionBar`, then splits the body into
the list and its filters with `ListPageContent`:

```tsx
<PageActionBar>
  <ListPageToolbar … />
</PageActionBar>

<ListPageContent
  filters={<FiltersPanel isOpen={isFiltersVisible} onClose={toggleFilters} onReset={reset}>…</FiltersPanel>}
>
  <ResponsiveListView … />
</ListPageContent>
```

Rules:
- **Every sticky bar is a `StickySurface`** — the page action bar, the section
  search on a record page, anything else that pins to the top. Detaching is one
  behaviour with one implementation, not something each bar re-decides. Two bars
  that frost differently, or one that frosts and one that never does, read as
  different components rather than one pattern, and that is what the shared
  surface exists to prevent.
- **A bar is transparent at rest and frosts once it detaches.** While it sits in
  the page it should read as part of it, so it carries no tint and no padding —
  a tint there would have to match a gradient backdrop exactly, and cannot. Once
  content is actually passing beneath it, it takes on the theme's glass and its
  padding, because by then the controls would otherwise be read through.
- Detachment is detected with a **zero-height sentinel** above the bar, not by
  watching scroll position: `position: sticky` fires no event of its own, and a
  scroll listener would need to know which element scrolls — which differs
  between a page that scrolls itself and a grid that scrolls internally.
- **Controls that do not earn their place on a floating strip drop out when it
  detaches**, leaving the search the full width of the bar.
- On tablet and below, a detached bar **takes on the page's name** — the heading
  has scrolled away by then, and without a sidebar nothing else on screen says
  which page this is. On desktop the bar stays as it is, since the sidebar
  already answers the question.
- **Never wrap a sticky bar in a sticky container of your own.** The outer one
  pins the inner one's sentinel at the top of the viewport, so it never leaves —
  and the bar it was meant to help is the one bar that can never detach. The
  symptom is a bar that looks permanently stuck and never animates, which reads
  as the component being broken rather than the page double-wrapping it. If a
  bar is not behaving like its neighbours, look for a second `position: sticky`
  around it before touching the component.
- Its `z-index` sits above page content but below drawers, modals and
  snackbars — the bar must never cover a dialog.
- It is applied unconditionally. On a page whose content scrolls internally
  sticky simply does nothing, and applying it everywhere means no page has to
  reason about it.

---

### A page that configures one record keeps that record on screen

Where a page exists to change settings for a single record — a client's feature
grants, one user's permissions — the bar identifying that record sits **outside
the scrolling region**, between the action bar and the content, never as the
first thing in the scroll.

The switches all look alike, and the deeper someone scrolls the less the screen
says whose they are. A settings page that has scrolled past its subject invites
the one mistake it cannot undo by itself: changing the right thing for the wrong
record. Keeping the name, identifier and status in view costs one row and
removes the question.

Put it in the page shell's flex column rather than making it `sticky` inside the
scroll: a sticky child of a translucent surface needs an opaque backdrop to stop
rows reading through it, and a sibling above the scroll region needs nothing.

### What gates something is managed beside it

Where one record decides whether another may exist — a subscription and the
features it grants, a licence and the seats it allows — they belong on the same
screen, the gating one read first. Split across a modal and a page, each is
edited without the other in view: features get switched on for a subscription
that lapsed weeks ago, and the renewal is priced without seeing what it buys.

### An expanded section has a fixed height

A collapsible section whose body can be long gives that body a **fixed height
and scrolls inside it**, rather than growing to fit.

An accordion that expands to fourteen rows pushes its own header off the top of
the screen, and a screenful of identical switches with no heading in sight is
exactly where someone configures the wrong record. A fixed height also means
every section opens by the same amount, so the page below never jumps by a
different distance depending on which one was clicked.

Height, not `max-height`: a short section that reserves the same space keeps the
page stable when moving between them. Leave room for the scrollbar so it never
sits on a control.

**One open at a time.** Where the sections hold near-identical controls — the
same switches for a different record — opening one closes the last. Two such
lists on screen together is the state in which the wrong one gets edited, and
the page stays short enough that the open section's own header is never far
from what it governs. A search still opens **one** result, not all of them:
the reader should not have to guess which header hides the match.

**Past a handful of sections, use a picker and a pane instead.** When only one
body is ever open, a column of collapsed headers spends most of the page saying
nothing. Lay the choices out as a row of tiles and give the chosen one a pane of
fixed height below them. The pane's height is what makes it work: one that grew
to its contents would move the tiles every time a different one was picked, and
the tile just clicked would land somewhere else.

Where the tiles stand for something with a state, **the state owns the tile's
colour** — subscribed, expiring, lapsed — so the row doubles as the summary and
is read before anything is clicked. Say what the colours mean in the empty pane,
where someone who has not clicked yet is already looking.

**One tile is always chosen, and the rest are muted behind it.** Two rules that
work together:

- **Picking is not a toggle.** Clicking the open tile keeps it open; it does not
  close it. The pane below is the page, so a row where every tile can be turned
  off has a state in which the page says nothing and offers no way back.
- **The chosen tile is brightened above its own colour**, not merely left at
  full strength. Against a row of held-back neighbours, more alpha on the same
  hue still reads as that hue turned up; lifting the colour itself is what makes
  it the obvious one.
- **Unchosen tiles are held well back** — their colour at low alpha, their mark
  and name dimmed — so the row reads as one tile in play among options rather
  than a set of equals. Restore them on hover: pointing at a tile should preview
  what picking it will do.

**This applies to a picker, and nowhere else.** A row that merely lists what
exists — the platforms someone can open from a home page — has no selection to
contrast against, and dimming it would make the whole row look disabled. Muting
is therefore opt-in on the tile, not its default.

Mute with alpha and opacity, never a CSS `filter` on the tile's wrapper — a
filter there cancels the glass card's `backdrop-filter` inside it, and the tile
loses its blur along with its colour.

**The pane's own headline fact goes in an `InfoPanel`** — the state of the
subscription, why the pane is locked — rather than being the first paragraph of
it. A pane that opens with plain text puts the thing everything else depends on
in the same voice as the detail below it. The panel's severity carries the
state, so the pane is placed before a word of it is read; its colours come from
the theme's palette, never fixed hex, so a callout survives both themes and a
project's own colours.

### Filters sit beside the list, not above it

Filters live in a panel to the **right of the table**, not in a bar above it:

- Filters and their results stay visible together. A bar above a long list
  scrolls out of reach exactly when the results need adjusting.
- Controls stack full width in a single column and go through `FilterSelect`,
  or `FilterMultiSelect` where a filter accepts several values, so a filter
  reads the same on every page regardless of how many that page has.
- **Nothing checked and everything checked both mean no restriction**, never
  "match nothing" — either way the user has not narrowed anything, so no row
  should be hidden. Offer only values that some row actually has; an option
  matching nothing is noise.
- A multi-select carries an **All** row that toggles every option — clicking it
  while checked is how a selection is cleared. No separate clear control: an
  open `Select` covers the page with its own backdrop, so a button on the field
  would be unreachable exactly when the user is choosing.
- Filter type is set **below body copy**, field and dropdown options alike. The
  dropdown renders in a portal, so its size has to be applied separately —
  `FilterSelect` exists to keep the two from drifting apart.
- The panel header carries a collapse chevron, and the toolbar's filter toggle
  opens and closes the same panel.
- A **Reset Filters** action is pinned to the bottom of the panel whenever the
  page has more than one filter.
- Whether the panel is open is **remembered across reloads**. One preference for
  the whole app is the default — someone who works with filters open expects
  them open wherever they go. A project whose lists differ widely in width may
  key it **per surface** instead: a filter column that is reasonable beside a
  six-column list crowds a twenty-column one, and a single flag forces the same
  answer on both. Pick one and apply it everywhere; what must not happen is some
  surfaces remembering and others not. The mobile overlay is excluded either
  way: it always starts closed, since restoring "open" would cover the page with
  a filter sheet on load.
- Opening the panel **reflows** the table rather than overlaying it — nothing is
  hidden behind the filters.
### On mobile

- The filter toggle sits at the **right edge of the toolbar**, and the search
  field takes the rest of the row — with no primary action, export or column
  management there, a fixed-width search would leave the row mostly empty.
  **Every search box sizes itself to the breakpoint** — `SearchField` in a list
  toolbar, `SectionSearchBar` on a record page — so this is the default rather
  than something each caller opts into. A caller passing an explicit width is
  overriding the rule, and a search field still narrow on a tablet is one that
  was given a width it did not need.
- Opening the filters shows a **full-screen overlay**, not a docked panel. A
  column beside the content would leave the list unusably narrow; taking the
  whole viewport gives the controls room and keeps the reset action within thumb
  reach at the bottom.
- The header's collapse chevron becomes a close action, since there is no
  panel to collapse back into.

---

## 3. Responsive rules

### One breakpoint

`useIsMobile()` is the only way to ask about screen size in a component. It
resolves to `lg` (< 1200px), covering phones and every common tablet including
the largest iPad Pro at 1194px. Never call `useMediaQuery` in a page.

### Mobile is opt-in, per page

A page is reachable on mobile only if its path is in `MOBILE_ALLOWED_PATHS`.
Everything else renders `DesktopOnlyNotice` when opened directly by URL, rather
than redirecting — a redirect hides the fact that the page exists.

Adding a page to mobile is a one-line change *plus* the work below. Never add
the path without doing the work:

1. Render rows through `ResponsiveListView` with a `renderCard`.
2. Build the card on `EntityCard`.
3. Confirm desktop-only affordances are hidden — `ListPageToolbar` already hides
   the primary action, export and column management.
4. Add the path to `MOBILE_ALLOWED_PATHS`.

### A mobile page is headed by its name, and nothing else

Below the breakpoint there is no sidebar to say which page the reader is on, so
the page names itself — through `PageHeader`, from the same source the nav entry
reads, so a page named once is named everywhere.

- **The name only. No sentence under it.** A description spends the most
  valuable rows on the screen explaining a page the operator has just chosen to
  open; it is read once, and after that it is only something to scroll past
  every visit. The nav entry that got them here already said what this is.
- **A page that heads itself opts out.** Where a page opens with its own
  greeting or summary, a title above it says the same thing twice before any
  content.
- It **scrolls away with the page** rather than pinning. It answers a question
  worth a glance on arrival and nothing after that — and once it has gone, the
  detached action bar carries the name instead (§2).
- On desktop it renders nothing: the highlighted nav entry already answers the
  question, and the heading would only repeat it.

### The bottom of a mobile screen

Every platform stacks the same furniture at the bottom, in the same order, with
the same spacing. A reader moving between products should not have to relearn
where the navigation is or how much of the page it covers.

From the bottom edge upward:

```
┌─────────────────────────────────────────┐
│  page content, scrolling under the bar  │
│                                   ╭───╮ │  ← transient: back-to-top
│            ╭───╮                  ╰───╯ │  ← disc, lifted clear
│  ╭─────────╯   ╰─────────────────╮╭───╮ │  ← pill, notched
│  │  ○      ○    ◉      ○      ⋯  ││ ⌯ │ │     glass, inset each side
│  ╰─────────────────────────────── ╰───╯ │  ← permanent: helpdesk
│        v1.2.3 · Powered by <mark>       │  ← attribution, pinned
│                                         │  ← safe-area inset
└─────────────────────────────────────────┘
```

Fixed relationships, so the proportions survive a change of numbers:

| | Rule |
|---|---|
| Pill inset | Equal at left, right and above the pill |
| Pill ↔ attribution | Flush. No gap between them |
| Disc rise above the pill | Exactly the pill's own inset, so it fills the band already reserved |
| Notch depth | Shallow enough to leave the active label a readable band beneath it |
| Attribution ↔ bottom edge | A small gap, then the safe-area inset |
| Corner stack ↔ pill | A small gap above the pill's top edge, measured from the same value |

- **The attribution shows the build version and the product mark**, in one
  centred line, at a size that reads as a footnote rather than content. It is
  the same line on desktop, where it sits at the end of the content column
  instead of being pinned.
- **It is the bottom-most thing on the screen.** Nothing is placed below it, and
  the safe-area inset goes underneath it — not between it and the bar.
- **Anything else pinned to a corner clears the pill, not the whole band.** The
  corner buttons sit where the disc never rises, so reserving the disc's
  clearance for them strands them high up the screen.
- **The bar is hidden on desktop entirely**, along with the pinning: the sidebar
  does that job, and the attribution returns to the page flow.

### The corner stack

Buttons pinned to the bottom-right corner — help, back-to-top — are **one
component, not several**, because the corner's geometry is a single decision:
what to clear, how far apart they sit, which order they stack in. Split across
two components each owns half of it, and the two halves drift until they
overlap.

- **The permanent button takes the lowest slot.** It is the one always on
  screen, so it belongs at the fixed anchor; a transient button then appears
  above it without moving anything. Anchoring the transient one instead makes
  the permanent button jump a slot the moment the page is scrolled.
- **Reserve the permanent button's band inside the scroll, and only that one's.**
  The content's bottom padding takes whichever reaches higher, the bar or the
  stack — otherwise the last row of a scrolled-to-the-end page sits under a
  button that never goes away. A transient button gets no reservation: it is
  absent on every short page, and reserving its slot would leave a strip of dead
  space there to protect content from something that is not there.
- **The stack sits below dialogs and full-screen sheets.** A modal's own actions
  are in the same corner and must always win; the stack's `z-index` is the app
  bar's, so they do.
- **Each button is a tooltip and an icon**, like any other icon-only control
  (§9), and carries the theme's glass rather than a solid fill (§12).
- **Only below the breakpoint.** On desktop the sidebar carries the help entry
  and the page scrolls normally, so a corner stack there is a second control for
  something already reachable.

### A help route is reachable from every screen

Wherever a platform offers support — a ticket form, a contact sheet — **it is
reachable from the shell, not from a page.** Someone who needs help is by
definition somewhere that is not working for them, and a help action that lives
on one page is the one place they will not think to look.

The shell already has two places for it, and both are used: the **sidebar** on
desktop, pinned near the profile, and the **corner stack** on mobile, where
there is no sidebar. One trigger per breakpoint, never both at a width — two
help buttons on screen reads as two different kinds of help.

Mount the dialog in the shell, lazily and gated on the state that opens it
(§11): it is reachable everywhere, needed rarely, and usually pulls in a
rich-text editor.

### A row of fixed-size tiles wraps — it is never a column grid

Tiles of a fixed size — platform marks, status tiles — are laid out as a
**wrapping flex row with one gap**, or as a scrolling row where the set is long.
Never as cells of a 12-column grid.

A column grid divides the width and expects its children to take the cell. A
fixed-size tile does not: give it a cell narrower than itself and it overruns
the cell and overlaps its neighbour. Nothing clips and nothing warns — the row
simply reads as cramped, and the narrower the screen the worse it gets, which is
why it survives review on a desktop and ships broken on a phone. A `6`-column
tile row that looks right at 1200px is four tiles deep in each other's space at
360px.

A wrapping row has no such arithmetic. It fits as many tiles as the width
actually holds, at the same gap on every screen, and needs no breakpoint values
to maintain.

- **Size the gap for the tile's own overhang.** A tile that throws a shadow or
  offset layer beyond its box needs the gap to clear it, or its shadow lands on
  the neighbour — and the row needs room on the overhanging edges, or the
  shadow is clipped at a scroll boundary.
- **Where the set can grow past one screen, scroll the row** rather than wrapping
  it into a block several rows deep, and keep its order stable so a tile stays
  where the reader last saw it.

### Tables become cards, never scrolling tables

A data grid with horizontal scroll is unusable on a phone. On mobile every list
renders as a stack of `EntityCard`s, one per row, in the grid's order. The empty
state is a centred sentence, never a blank screen.

### Hover actions become buttons

Hover does not exist on touch. Every hover-revealed grid action becomes a
permanent button on the card:

| Desktop cell | Mobile field | Actions |
|---|---|---|
| `CopyCell` | `CardField` | copy |
| `EmailCell` | `EmailField` | send, open in mail app, copy |
| `LinkCell` | `CardField` | open, copy |
| phone `CopyCell` | `ContactNumberField` | call, copy |

Keep each pair in step: an action added to a cell is added to its field.

**Writing to an address always offers both routes** — the composer inside the
app, and the reader's own mail client — through `EmailOptionsMenu`, wherever the
address appears. Sending from the app keeps the message on the record; their own
client has their signature, drafts and sent items. Which one is wanted depends
on the message, so neither may be chosen silently on the user's behalf.

Which **row** actions survive on mobile is a per-page decision and must be
stated explicitly — one page may be fully view-only while another keeps a single
action. When in doubt, drop the action rather than shipping a cramped one.

### A value that exists to be pasted carries a copy button

Any field holding something meant to be used elsewhere — a credential, a key, an
endpoint, a generated identifier — gets `CopyAdornment` at its end, whether the
field is editable or read-only. Selecting a long secret by hand is easy to get
wrong by one character, and the mistake does not surface where it was made: it
surfaces later as an authentication failure with nothing to point at.

A tick for a moment is the whole confirmation. A snackbar for a copy is more
ceremony than the act deserves, and it covers the page it was copied from.

### Navigation

- Desktop: collapsible sidebar, grouped, with expandable submenus.
- The sidebar names the **company being worked in**, in a bordered card between
  the collapse toggle and the first nav entry. Expanded, a small "Company" label
  sits over the name; collapsed, only the company's mark remains, with the name
  in a tooltip. The mark follows §4's rule for real marks: the company's own
  logo where it has one, otherwise its initials on a coloured tile — never the
  product's placeholder logo, which already sits directly above it.

  **Collapsed, the card is a square**, and its height is *derived* from the
  collapsed rail's width less its own inset rather than set by hand. A card
  taller than it is wide reads as a row with its label cut off instead of a tile
  holding a mark; and a hand-set height falls out of square the moment the rail
  or the inset changes, which nothing catches because nothing breaks — it just
  stops looking deliberate. Size the mark to leave the same margin on all four
  sides of that square.
- **Collapsing the rail changes its width and nothing else.** Every row keeps one
  fixed-width icon lane, left-aligned, in both states; the company card keeps a
  fixed height. Only labels appear and disappear.

  This is the rule that is easiest to break by accident. Collapse flips the
  expanded/collapsed flag instantly while the rail's width animates over a few
  hundred milliseconds, so anything derived from the current width resolves
  against a width that is still moving. An icon centred in the rail sweeps most
  of the way across it; padding or a height that shrinks on collapse jumps the
  whole list below it. Neither reads as a width animation — it reads as the
  sidebar coming apart. Do not centre on collapse, and do not make spacing,
  padding or height conditional on the collapsed state.
- Mobile and tablet: a bottom bar of direct links, with the last slot always
  "More". It is a **floating pill** — inset from all three edges, fully rounded,
  opaque — not a bar fixed flush to the bottom of the viewport.
- **At most five slots**, and **the page people return to most sits in the
  centre one** — not the first. With "More" fixed at the end, five slots put it
  third: the middle of the bar, and the easiest point to reach with either
  thumb. Ordering the primary list is therefore a layout decision, not just a
  priority one.
- **Only the active slot is labelled**, beneath its disc, in the band the notch
  leaves clear. The inactive slots stay icon-only — labelling all five at this
  width would either truncate every one of them or force the bar taller than it
  needs to be. Because the label gets less room than a full slot, **the bar's
  titles are its own and shorter than the sidebar's**; a sidebar name that
  arrives truncated means the bar needs a shorter name, not a smaller font.
- **The active slot is a disc in the brand's primary colour that lifts clear of
  the pill, with a notch cradled into the bar beneath it.** There is exactly one
  disc, shared by every slot: it slides to the slot you pick, and the notch
  slides with it, driven by the same value so the hole and the disc cannot drift
  apart mid-transition. A disc per slot, cross-faded, reads as two objects
  rather than one moving — and a notch that animates independently makes the
  disc look torn free of the bar.
- **The notch joins the top edge through a fillet on each side — never
  directly.** A circular bite taken straight out of a flat edge meets it at a
  cusp: a sharp point at each shoulder, which is the single detail that makes
  this pattern look cheap. The fillet is an arc tangent to both the top edge and
  the notch circle, so the boundary never changes direction abruptly. This is
  why the bar is drawn as a path rather than cut with a mask or a border radius —
  a gradient mask can subtract a circle but cannot add the two fillets back.
- Because the shoulders need flat edge either side of them, **the slot row is
  inset from the pill's ends** by enough that the outermost notch clears the
  rounded cap at the narrowest supported viewport. Check that arithmetic when
  changing the pill's height, the disc's size or the slot count — it is the
  constraint that breaks first and it breaks silently, as a notch mangled into
  the end cap.
- **Because the bar floats, the space it reserves is not its own height.** The
  exported height constant is the whole band — the pill, plus the clearance
  above it the lifted disc needs — since page shells, full-height pages and
  anything else measuring against the bar all read from it. Return the pill's
  own height there and every one of them sits too low.
- The pill sits **flush on the top edge of the attribution**, with no gap
  between them: the two are one block of furniture at the bottom of the screen,
  and vertical space on a phone is worth more than the separation.
- The bar carries **the same glass as the rest of the theme** — a translucent
  fill over a blurred backdrop — so it reads as the sidebar's material rather
  than a solid puck laid on the page. Two details follow from that and are easy
  to get wrong: `backdrop-filter` is cancelled by a `filter` anywhere above the
  element, so a shaped drop-shadow and a blurred backdrop cannot sit on the same
  element; and `box-shadow` follows the element's rectangle, not a clipped
  outline. A notched glass surface therefore needs its edge **stroked as a
  path**, not drawn as a border or a shadow.
- **The product attribution sits below the bar, pinned to the bottom of the
  viewport** — the bar floats above it. On desktop it stays in the page flow at
  the end of the content column. It needs **no background of its own**: the page
  reserves its band and stops above it, exactly as the stacked desktop layout
  does, so nothing ever scrolls behind it.
- **The bar is the only thing that overlaps the page.** The two clearances are
  reserved in different places, and swapping them is the mistake to avoid:
  - the **attribution's** band is reserved on the scroll container's *parent*,
    so the scroll area ends where the attribution begins;
  - the **bar's** band is reserved *inside* the scroll container, as padding on
    the content, so the page runs under the bar while its last content can still
    be scrolled clear of it.

  Reserve the bar's band on the parent as well and the page ends early, leaving a
  dead strip of backdrop under it — a visible gap in the layout, and a glass bar
  with nothing behind it to blur.
- **A viewport-locked page shell is a desktop arrangement only.** On tablet and
  below, a page that pins itself to the viewport and scrolls a grid inside
  itself has nothing left to scroll at page level — so its heading can never
  scroll away, and its action bar can never detach and frost. The result is a
  stack of permanently pinned furniture above a small scrolling window, which is
  both cramped and visibly unlike every other page. Below the breakpoint those
  shells scroll normally; there is no grid to lock to anyway, since those lists
  render as cards.
- **Every element fixed to an edge adds that edge's safe-area inset, and so do
  the page's gutters.** Devices reserve strips of their own screen: the home
  indicator along the bottom, the dynamic island or a notch at the top, and — in
  landscape, or on a phone with curved glass — the sides. Anything pinned
  without the inset renders underneath the hardware, where the OS draws over the
  content and takes the swipes before the page sees them. Content that merely
  sits near an edge needs it too: curved glass bends the last few millimetres of
  the page away from the reader.

  Four rules make this hold rather than being remembered case by case:

  - **The insets are named constants, one per edge**, beside the layout's other
    measurements — not `env()` written out at each call site. They have to be
    CSS `env()` expressions composed with `calc()`, since only the browser knows
    the values, and a hand-written one is how an edge gets missed.
  - **Left and right are set separately, never through a single `px`.** A phone
    in landscape reports a large inset on the notch's side and none on the
    other; one figure for both either wastes a gutter or leaves the notch
    overlapping.
  - **The top inset is reserved once, on the shell**, above both the banner and
    the scroll area, rather than by each of them separately.
  - **A full-screen sheet reserves all four itself.** It paints into the unsafe
    areas like any other fixed surface, and the control most likely to be lost
    is the one pinned to its bottom edge — exactly the action it exists to
    offer.

  It reports 0 unless the viewport meta tag opts in with `viewport-fit=cover`.
  The tag and the insets are one change: the tag without them pushes content
  under the hardware, and the insets without the tag silently do nothing.
- **A gutter that carries an inset is never bled away.** A full-bleed page shell
  reclaims the content container's gutters to give a table the full width — a
  desktop arrangement, and below the breakpoint it must stop: the gutter there is
  partly the device's own reserved strip, and giving it back puts the page's edge
  under a curved screen or a landscape notch. Keep the container's gutters below
  the breakpoint and re-apply nothing, rather than cancelling them and adding a
  smaller padding back, which silently undoes the insets.
- **Compact gutters are not minimal gutters.** The tightest value that still
  fits the content is the wrong one for a hand-held device: the page's edge is
  where a thumb rests, where glass curves away, and where the browser puts its
  own gesture zones. Give a compact screen a gutter in its own right, then add
  the inset on top of it.
- "More" shows the **complete** navigation tree — groups, submenus and all —
  minus whatever the bottom bar already links to. Desktop-only pages stay
  listed; they render the notice when opened.
- Separators left leading or trailing after that filtering are dropped.
- Parent items with children toggle their submenu rather than navigating, since
  a parent path usually has no route of its own.

---

## 4. Table rules

Use `AppDataGrid`. It carries the following centrally so no page re-decides
them: compact density, striped rows, vertical cell borders, the shared column
menu, paging capped at 50 rows, and the sticky columns below.

### Sticky columns

The first visible column and the actions column stay pinned to the edges while
the table scrolls sideways — **headers included**.

Implementation notes that are easy to get wrong, all handled inside
`AppDataGrid`. Preserve them when porting:

- Column pinning is a **paid/Pro feature** of the grid library. The free tier
  needs the CSS implementation.
- Virtualisation is disabled. Virtualised columns unmount when they leave the
  viewport, and the virtualised row window is positioned with a `transform` —
  which becomes the containing block for sticky cells and drags them off screen
  as you scroll vertically. Page sizes cap at 50 rows, so rendering a whole page
  is cheap. **That cap is therefore load-bearing, and no project offers more than
  50.** Which sizes a project offers below it, and which it defaults to, is a
  local choice: a dense back-office list reasonably defaults to 50 where a
  sparse one defaults to 10.
- Stuck columns need **fully opaque** backgrounds. Surfaces are translucent and
  anything less lets scrolled cells read through and blur the text.
- Stuck headers need a `z-index` above the grid's column separators, which sit
  high (30 in MUI X) and overhang their own header by a few pixels.
- Address the pinned columns by **field name**, not by column index: header
  cells usually expose only `data-field`, so an index-based selector silently
  matches nothing.

### Resizing

**Columns are resizable, and the grip that resizes them is visible without
hovering to find it.** Resizing is free in the grid's Community tier and on by
default, but turning on vertical cell borders makes the library hide every
separator until the pointer is already inside a 10px strip — with nothing on
screen to say the strip is there, the table reads as fixed-width and nobody
tries. `AppDataGrid` restores the grips; a table that genuinely must not be
resized opts out explicitly.

### Action column

Name the field `actions` — the sticky-right rule keys on it, so a differently
named column will not pin. Put it last, and **it is always sticky**: actions
must stay reachable no matter how far the table is scrolled sideways.

**At most four controls: three direct actions plus one `⋮` More menu**, built
with `RowActionsMenu`.

**Every table that records an audit trail carries `View History Logs` in that
menu**, rendered with `HistoryDialog` (§8). It is read-only, belongs to no
particular workflow, and is needed rarely — exactly what the overflow menu is
for. A table whose rows can be edited but offers no way to see what changed is
incomplete.

- The three direct slots go to the actions used most often.
- Everything else — rare, destructive, or secondary — lives in the More menu.
- Four icons is the ceiling, not a target. Two direct actions plus More is
  better than padding the row out to four.
- A row with four or fewer actions total may skip the More menu and show them
  directly; the limit is on *width*, not on menu usage.
- Conditional actions count toward the three. If a row can show Edit, Maintain
  and Activate depending on state, that is already the full budget — the next
  action goes in the menu.

The cap exists because the action column is pinned: every icon added to it
permanently narrows the scrollable region for actual data. It also keeps the
column's `minWidth` at `COLUMN_MIN_WIDTH.actions`, which is sized for exactly
four compact buttons.

### Numeric columns

Numbers are read by comparison down a column, so they are formatted for
scanning, not for prose.

- Grouping separators always: `1,234.50`, never `1234.5`.
- **Two decimal places** for measured or calculated figures — rates, hours,
  percentages, quantities — so the decimal points align.
- **Counts are the exception**: whole things that are tallied render without
  decimals. "42 clients", never "42.00 clients".
- Right-aligned, with `align: 'right'` on the column so the header sits over
  the figures.
- Fixed-width digits (`font-variant-numeric: tabular-nums`) so digits line up
  vertically instead of drifting.

Use `NumberCell`; pass `isCount` for tallies.

### Money columns

Money follows accounting conventions, which are stricter than plain numbers.

- **Right-aligned**, with the **currency symbol at the leading edge of the cell**
  and the figure at the trailing edge — the ledger layout, so symbols form one
  column and decimal points form another.
- **Decimal places come from the currency, never a hard-coded 2.** ISO 4217
  defines the minor units: most currencies use 2, JPY and KRW use 0, KWD and
  BHD use 3. `Intl.NumberFormat` with `style: 'currency'` resolves this per
  currency — rely on it rather than `toFixed(2)`.
- **Never drop the minor units for display.** `maximumFractionDigits: 0` on a
  money figure silently hides cents and makes totals look wrong.
- **Negatives in parentheses** — `(1,234.56)` — via `currencySign: 'accounting'`.
  A leading minus is easy to miss in a column of figures.
- Fixed-width digits, as above.
- Rounding is a **display** concern only. Round at the presentation layer, never
  in stored or computed values, and never compound rounded figures into a total
  — sum the precise values and round the result once.

Use `CurrencyCell` in tables, and `formatCurrency` where there is no column to
align within, such as a summary tile or a sentence.

### Money everywhere else

**These rules are about money, not about tables.** They apply identically to a
grid cell, a card, a form input, a modal, a summary tile, a PDF and an export.
Money formatted one way in a table and another way in the detail panel beside it
is the defect this section exists to prevent — never hand-format an amount with
a hard-coded symbol and `toLocaleString()`.

| Context | Use |
|---|---|
| Table cell | `CurrencyCell` |
| Card or detail panel | `MoneyField` |
| Form input | `CurrencyField` |
| Sentence, tile, snackbar | `formatCurrency` |

**Inputs.** Use `CurrencyField`, never a bare `type="number"`:

- A number input accepts exponent notation and unlimited decimals, so it
  silently permits amounts the currency cannot express, and its spinners are
  meaningless for money.
- Cap the entry at the currency's minor units as the user types — see
  `getCurrencyDecimals`.
- Hold the value as a **string** while editing. Converting to `number` on each
  keystroke destroys a half-typed `12.` and forces money through a float more
  often than necessary. Convert once, on submit.
- Show the currency symbol as a leading adornment and right-align the figure, so
  the input reads the same way the table does.

**Storage and arithmetic.** These are correctness rules, not presentation:

- **An amount is meaningless without its currency.** Store and pass the currency
  code alongside the amount. A bare `number` field called `amount` is a bug
  waiting for the first non-default currency.
- **Never do money arithmetic in binary floating point.** `0.1 + 0.2` is not
  `0.3`, and cents drift as figures accumulate. Store and compute in **minor
  units as integers** (cents, not dollars), or use a decimal library. Convert to
  a display value only at the edge.
- **Round once, at the end.** Sum precise values and round the result; never
  total a column of already-rounded figures, or the total will disagree with its
  own rows.
- **Rounding is a display concern.** Never write a rounded figure back to stored
  data.
- Totals, subtotals and the rows above them must reconcile exactly. If they
  cannot, the rounding is happening in the wrong place.

### Recurring amounts

An amount charged on a cycle is as meaningless without its cycle as it is
without its currency. Store the two together, and treat a bare "monthly amount"
field as the same bug: the first yearly arrangement makes every total wrong by a
factor of twelve, silently, in the direction that flatters the figure.

- **Normalise before comparing or totalling.** One shared helper converts an
  amount to a common period; nothing divides by the cycle length on its own.
- **Offer the amount in the cycle it is charged**, labelled as such — "Yearly
  Amount", not a monthly figure the operator has to work out.
- **A term is not one cycle.** How long a commitment runs is independent of how
  often it is billed: a yearly arrangement may be signed for three years. Offer
  the common terms as a single choice and derive the end date from the start
  date and the term, so nobody counts on a calendar.
- **The end date stays the stored value**, because it is what decides whether
  something is still live. A term chosen from presets writes that date; a custom
  end date is typed directly. Never store both a term and a date — they are one
  fact, and two copies of it drift.
- Where a figure is normalised for a summary, say so in the label or beside it.
  A total that quietly converts yearly amounts is right, but only defensible if
  the reader can tell.

**An arrangement already in force is extended, not edited.** Its start date is a
record of when it began, so that stays fixed; what an extension settles is how
much longer it runs and on what terms from here. Offer the full set of fields
when there is nothing yet; afterwards offer the new term **together with the
price and cycle it will run at** — renewals are commonly repriced, and making
that a separate edit is how a term gets extended at last year's rate. Show the
previous price beside the fields so a repricing is a decision rather than an
accident.

- Extend a live arrangement from **its current end date**, so no time already
  paid for is given away; extend a lapsed one from **today**, or the term buys
  back a period that has already passed and may expire the moment it is renewed.
  Label the two differently — *Extend* and *Renew* — since the second is
  repairing a gap.
- Reject an end date that is not later than the one in force. A shortening
  offered under the word "extend" is how a term is cut by accident.
- **Warn before the end date, not on it.** An arrangement inside its warning
  window reads as *Expiring Soon* — its own state, not a variant of active — so
  a renewal is something the team walks into rather than discovers. Size the
  window to how long the conversation actually takes, name it as a constant, and
  let the action beside it take on the same urgency as the label. On the end
  date itself it is expiring, not expired: access does not lapse until the day
  is over.
- **Where there is no end date, editing is the action** — an arrangement that
  runs indefinitely has no term to extend, so its details are the only thing
  left to change. Giving it an end date is itself a change made there, and from
  then on it is extended like any other.

### Column widths

Every column declares a `minWidth` from `COLUMN_MIN_WIDTH`, sized to the content
it carries, so cells never clip:

| Token | Width | For |
|---|---|---|
| `compact` | 110 | versions, counts |
| `status` | 130 | chips |
| `select` | 160 | editable chips |
| `amount` | 140 | currency |
| `label` | 150 | short labels |
| `actions` | 150 | icon strips |
| `identifier` | 170 | display IDs |
| `date` | 170 | timestamps |
| `person` | 180 | a name as plain text |
| `name` | 210 | avatar + name |
| `email` | 240 | addresses |
| `wide` | 260 | URLs, descriptions |

Size the token to whichever is wider, **the content or the header**. A status
chip reading "Active" under a header reading "Client Status" is set by the
header — pick the token that fits the label, or the column heading truncates
while the cells sit in plenty of space.

A blanket minimum is wrong in both directions — too wide for a status chip, too
narrow for an email. Tables are **expected** to scroll horizontally when the sum
exceeds the viewport; that is what the sticky columns exist for.

### A thing with a real mark shows its mark

Where an entity has a logo of its own — a platform, a client, the product
itself — render it through one component that falls back to a coloured glyph for
the entities that have none. Two rules follow from that:

- **A full-colour mark is never laid inside a tinted disc.** The disc and its
  colour belong to the fallback — they exist to give a flat glyph or two initials
  a shape and tell one apart from the next. A real logo already has both, and
  many are transparent, so a tint behind one shows through as a coloured disc
  its owner never chose.
- **Fit the mark, never crop it.** Avatar components default to `cover`, which
  trims a wide logo to a square; `contain` shows what was uploaded.
- **An image cannot be tinted the way an icon can.** Where a glyph would go
  muted or disabled, drain the image of colour instead — same meaning, by the
  only means available.

Logo paths live with the brand colours, not in the component that draws them.

### One person, one card

**Wherever the signed-in person is shown — their avatar, name, company, roles,
addresses — it is the same card.** `UserIdentityCard`, not a per-page hero.

A page needing more puts it in `trailing` or `children`; a page needing the
avatar to do something passes a click handler. Restyling it, or rebuilding the
layout locally, reopens the gap this closed: the same person and the same facts
rendered as two different cards, which reads as two different products rather
than two pages of one.

**The avatar and the name stay on one row at every width** — the avatar shrinks
on a phone rather than the name dropping beneath it. A name wrapped under its
own avatar stops reading as a label for it and becomes two unrelated things
stacked. Only a trailing slot may take its own row on a narrow screen.

### A row that needs attention is tinted

Where one row in a table is in a state someone has to act on — a platform under
maintenance, a record mid-import — **flag the row itself** through
`AppDataGrid`'s `getRowFlag`, rather than leaving it to be found by reading down
the status column.

- The flag says **which kind of attention**: `warning` for something happening
  now, `info` for something booked to happen. Both tints are defined once in the
  grid, so a flagged row looks the same in every table and the two never blur
  into one another.
- Return the flag, never a `getRowClassName` of your own: that replaces the
  striping instead of adding to it, and each table ends up choosing its own
  highlight colours.
- The tint goes on the **cells**, not the row. The first and action columns are
  stuck to the table's edges with opaque backgrounds of their own, so a tint on
  the row alone stops at the second column.

### Who a maintenance notice is shown to

**The banner is scoped to its audience, and the two audiences are not the same.**

- On a **client-facing platform**, it appears only when *that* platform is the
  one under maintenance or booked for it. A client has no interest in another
  product being deployed, and no business knowing it is.
- On the **operator-facing platform** — the one deployments are run from — it
  appears for *any* platform with a run under way or booked. Operators are
  answerable for all of them, and the one worth reminding them about is
  precisely the one they are not currently looking at.

This is a filter, not a feature flag, and it is the thing to get right when
porting the banner. The operator's copy reads from a store covering the whole
estate; drop that component into a client platform unchanged and it will
announce every client's deployment schedule to every other client.

The same split governs anything else that reports on the estate — a status
badge, a count in the navigation. Scope it to the platform the reader is in,
unless the reader is the one running them all.

### Something booked for later is announced, and can be called off

An operation scheduled rather than started — a deployment booked for a quiet
hour — needs three things, and shipping any two of them leaves a trap:

- **It is announced wherever the running version would be** — the same banner,
  the same badge — because the person on duty when it fires is rarely the person
  who booked it. Show it in a **calmer colour** than the live operation: a
  booking takes nothing offline, and dressing it as an outage teaches people to
  ignore the colour that means one.
- **A live operation outranks a booking** when both exist. Two banners bury the
  page under its own chrome.
- **It can be cancelled from the record it belongs to**, as an action on that
  row — not only from the screen it was booked on. Without that, the only way
  out of a wrongly-dated booking is to wait for it to happen. Refuse a time in
  the past at the point of booking rather than quietly treating it as "now".
- **One per record, not one in total.** Any number of records may each have a
  booking; a single record may not have two. Scope the constraint to the record,
  never to the estate — a global limit silently stops a second platform being
  booked at all, which is a different and much larger rule than the one
  intended.

  Opening the action on a record that already has one shows **the one it has** —
  not an empty form that would replace it. From a booking, the operator may move
  it to another time, start it immediately, or call it off; the type and target
  carry over untouched, because re-entering them is a chance to enter them
  differently from what was agreed.

  The failure this prevents is quiet: a form that looks like "book a
  deployment" but is really "overwrite the one already booked" loses an
  arrangement someone made with a client, and says nothing as it does.
- **Where several bookings can exist, the banner names the soonest and counts
  the rest.** One band per booking stacks until the page has no room left, and
  the next one due is the only one actionable now.
- **Booked and running never share a colour.** Wherever both can appear — the
  banner, a flagged row, a status chip — the running one takes the warning
  colour and the booked one an informational colour. They are found the same
  way and mean different things, so a single colour for both is a colour that
  has stopped carrying the difference, and the reader has to open the record to
  learn which they are looking at.

### Status colours

Never map a status to a colour inside a page. Add it to `STATUS_COLORS` so the
same word is never two colours in two places.

### Creating one record from two places

Where a record can be created from more than one screen — a client from its own
page and from converting a lead — the fields live in **one** component under
`components/forms/`, named for the record (`ClientFields`), and every form
composes it. It renders bare `Grid` items so the caller owns the container and
can put its own sections around it.

Writing the fields out a second time is how a field ends up required in one
place, absent in the other, and missing from whatever is created by the screen
nobody revisited.

Where one record's creation implies another's — converting a lead creates the
client *and* its first point of contact — ask for both in the same form. The
second record's fields prefill from what is already known, and stay editable: a
record captured quickly is exactly the one that needs correcting at the moment
it becomes permanent.

### Editable cells

A field the operator decides — a stage, a status, a tier, an assignee — is set
from the row with `SelectCell`, not by opening the record's modal to change one
value. The chip keeps the colour it has when read-only, so the column still
scans by colour and only the caret marks it as editable; use `COLUMN_MIN_WIDTH.select`
to leave room for the caret.

Three rules:

- **Only where the value is a judgement.** Anything the system derives or stamps
  stays read-only — never offer a choice that will be overwritten.
- **Offer every value, including the terminal ones.** Someone who tagged a stage
  too early must be able to correct it, and a dropdown missing its own current
  value cannot display it.
- **One path to a value with side effects.** Where a choice does more than write
  the field — converting a record, stamping a closing date — route it through
  the same handler the action button uses rather than writing the field
  directly, so both entry points behave identically.

Where an editable cell covers a transition, drop the button that only performed
that transition. Two controls for one change is how they drift apart.

---

## 5. Display identifiers

Records show a human-readable identifier — prefix, separator, zero-padded
sequence — built by `formatEntityId` from `ENTITY_ID_FORMATS`:

```ts
// Prefix and padding come from ENTITY_ID_FORMATS, so they differ per project.
// With { prefix: 'ACME-EMP', padding: 5 }:
formatEntityId('employee', 1) // 'ACME-EMP-00001'
```

- Prefix and padding are **configuration**, per entity type, in one source file.
- There is deliberately **no settings page** for them. This is a build-time
  decision for developers, not something an operator should change while records
  already exist.
- Never build an identifier inline with a template literal and `padStart`. That
  is how the same entity ends up formatted two ways on two screens.
- A sequence longer than `padding` renders in full rather than being truncated,
  so identifiers stay unique once the range is outgrown.
- Whatever a list **displays**, its search must also **match** — format the
  identifier inside the search predicate too, or users will search for the ID
  they can see and get nothing.
- **An identifier on screen carries a copy action**, like any other value that
  exists to be pasted. It is quoted in tickets, pasted into searches and read
  back over the phone; retyping one by eye is how a single character goes wrong
  in a way that surfaces much later. Where it sits among contact details, it is
  a `ContactChip` like they are — set `monospace`, since an identifier is
  checked character by character rather than read as a word.

### Links carry a uuid, never the primary key

A record's own key stays internal. Anything that appears in a URL — a route
parameter, a query string, a shared link — uses a separate opaque `uuid` on the
record.

A sequential key in a link tells whoever sees it how many records exist and
where this one falls among them, and invites editing the number to reach a
record nobody offered. Neither is information a link should carry, and the one
that reaches another record is a hole as well as a leak.

Store data against the key as before: resolve the uuid to the record once, at
the edge, then use the record's key internally. Records that never appear in a
link do not need one.

---

## 6. Dates and times

**Timestamps are stored in UTC and displayed in the application's configured
timezone.** Never in the viewer's local timezone.

The device timezone is not the business timezone. Two people looking at the same
record from different places must see the same date — and near midnight, they
must see the same *day*.

### Rules

- One configured zone for the whole app, in `constants/date-time.ts`, as an
  **IANA zone name** (`Asia/Manila`) rather than a fixed offset, so daylight
  saving is the platform's problem and not arithmetic anyone has to maintain.
  Changing that one value moves the whole app.
- **Format only through the shared helpers** in `utils/format-date.ts`. Never
  call `toLocaleString`, `toLocaleDateString` or `toLocaleTimeString` in a
  component — with no `timeZone` option they silently fall back to the device.
- **Never read calendar fields off a `Date`.** `getDate()`, `getMonth()` and
  `getFullYear()` return browser-local values; a timestamp late in the day
  renders as the wrong date for anyone in a different offset. Derive parts from
  `Intl.DateTimeFormat(...).formatToParts()` with an explicit `timeZone`.
- **The display locale is fixed too**, so `10 Mar 2026` never renders as
  `3/10/2026` for some viewers.
- Sorting and comparison use the raw ISO instant, never the formatted string.

### Formats

| Helper | Output | For |
|---|---|---|
| `formatDate` | `10 Mar 2026` | dates without a time |
| `formatDateTime` | `10 Mar 2026 08:15:00` | audit and history timestamps |
| `formatDateTimeShort` | `10 Mar 2026 08:15` | lists, where seconds are noise |
| `formatHistoryDateLong` | `Mar 10, 2026 08:15:00` | detail panels |
| `toDateInputValue` | `2026-03-11` | the value an `<input type="date">` takes |

### Date inputs

`<input type="date">` holds a bare `YYYY-MM-DD` with no timezone, so converting
an instant for it is where bugs hide.

**Never use `toISOString().slice(0, 10)`.** That reads the date in UTC, so any
evening timestamp in a positive offset lands on the previous day and the field
shows a day earlier than the rest of the screen. Use `toDateInputValue`, which
resolves the date in the app's timezone.

A date-only value is stored as midnight. Converting midnight UTC into a positive
offset keeps the same calendar date, which is why this reads correctly — but
only when the conversion happens in the configured zone.

**Calendar arithmetic on a date-only value works on its parts, not on a `Date`.**
Adding months to a `YYYY-MM-DD` string by putting it through a `Date` reintroduces
the timezone the string does not have, and lands an end date a day out for half
the world. `addMonthsToDateInput` and `monthsBetweenDateInputs` do the arithmetic
on the string's own year, month and day — and clamp to the end of the target
month, so a span counted from the 31st ends on the 28th rather than spilling into
March.

---

## 7. Confirmation rules

Match the confirmation to the stakes. Every state-changing action gets exactly
one of these — never a bare button, never two layered.

| Pattern | Component | Use when |
|---|---|---|
| Password | `WithPassword` | Destructive or privileged: deactivate, revoke, reset, delete |
| Reason | `WithReason` | Reversible but needs an audit trail: revert, reject, cancel |
| Confirm | `WithPopover` | Plain yes/no with no lasting consequence |
| None | — | Read-only: copy, open, export, view |

Rules for all three:

- They are popovers anchored to their trigger. When the trigger sits inside a
  menu that closes on click, keep a `ref` on the **menu button** and anchor
  there — the menu item unmounts and the popover loses its anchor otherwise.
- Confirm stays disabled until the requirement is met (password typed, reason
  given).
- On success, report with a snackbar naming the record and what happened:
  *"**Acme Corp** has been deactivated."*
- A required rich-text field gates its action through a content check, not a
  truthiness check — an "empty" editor still emits `<p></p>`.

---

## 8. History logs

Every record that can be edited exposes its audit trail the same way. Reach it
from the row's overflow menu as **View History Logs**, and render it with the
shared `HistoryDialog` — never build a bespoke history view.

### Structure

A dialog titled for the record (`History Logs — Acme Corp`), containing one card
per audited change:

- An accent rail in `primary.main` down the left edge marks each card as one
  change event.
- The header reads **`Name · 01 Jan 2026 08:00:00`** — who, then when, grouped
  together rather than pushed to opposite edges.
- A divider, then one row per field changed in that event.
- Each row is the field name, the old value, an arrow, the new value.

### Colour carries the direction

| Element | Colour |
|---|---|
| Old value | `error.main` — red |
| Arrow | `text.disabled` — muted, so values read first |
| New value | `success.main` — green |

Whether a change was an increase, a grant or a removal should be readable at a
glance without parsing the words.

### Rules

- **Newest first**, always. Order is derived from `changedAt` inside the
  component, not from the order entries happen to arrive in — otherwise every
  caller has to remember an unwritten convention, and one of them will not.
- **`changedBy` is a person's name, never a role or job title.** An audit trail
  exists to say who is accountable; "Admin User" answers nothing. The one
  exception is `System`, for changes no user initiated.
- **Field names share a minimum width** so the arrows line up down the card.
- **Text is set smaller than body copy**, and the `Name · timestamp` header
  smaller still. History is reference material read in bulk: the priority is
  fitting more entries on screen, and the header only labels the change that
  follows it.
- Read-only. A history view never edits anything, so it needs no confirmation
  and no action buttons.
- Empty state is a plain sentence, not a blank panel.

### Data shape

```ts
interface HistoryEntry {
  id: string;
  changedBy: string;   // person's name
  changedAt: string;   // ISO timestamp — drives ordering
  changes: { field: string; from: string; to: string }[];
}
```

Record values as **display strings**, already formatted — money with its symbol
and decimals, dates in the app's format, multi-value fields joined. The history
view renders what it is given and must not re-derive formatting.

---

### Notes are not history

A record can carry both, and they are different things. **History** is what the
system observed changing: nobody writes it and nobody may edit or delete it.
**Notes** are what a person chose to say, so the author — and only the author —
may remove one. Never let a colleague delete someone else's note: a record of
what was said becomes a record of what survived.

`NotesDialog` matches `HistoryDialog` deliberately — same width, same header,
same entry cards and type scale — because the two usually sit behind adjacent
actions on one row. The composer sits above the list so writing never means
scrolling past what is already there.

Enforce authorship in the **store**, not only by hiding the button. A UI check
is a courtesy; the rule belongs where the data changes.

### Storing a person on a record

Reference people by **id** wherever they have an account. A name written into
the record cannot follow the Name Settings format and does not change when the
person's name is corrected. Resolve the id at render through `PersonNameCell`
or `usePersonName`.

Where the person may have no account — an outside referrer, a third-party
contact — store **name parts** (`firstName`, `middleName?`, `lastName`), never
one typed full name. Parts still format correctly, and they hold the entry to
one shape: a single free-text box collects "dela Cruz, J.", "Juan Dela Cruz" and
"J. dela cruz" for the same person, and nothing downstream can tell they match.
Anything else the record needs about that person — an email, a number — belongs
in the same object, not in loose fields beside it.

---

## 9. Action button rules

**Every action button carries an icon.** No exceptions — toolbars, modals,
menus, cards.

- Buttons: `startIcon`, sentence-case label, `size="small"`.
- Icon-only buttons: always inside a `Tooltip` with `placement` and `arrow`. An
  icon alone is not a label.
- Toolbar icon buttons: `ToolbarIconButton`, which highlights while the panel it
  controls is open.
- In-cell icon buttons: `CellIconButton`, which stops propagation so using an
  action never also fires the row click.
- Overflow menus: a `MoreVert` trigger, `ListItemIcon` on every item,
  destructive items last and below a divider.
- Colour by intent: `primary` create, `info` view/edit, `secondary` related
  records, `warning` reversible state change, `error` destructive.
- A disabled button needs a tooltip saying what would enable it, and must be
  wrapped in a `<span>` so the tooltip still fires.
- **Truncated text carries a tooltip with the full value — and only then.**
  Use `useIsTruncated`: a tooltip on a label that already fits repeats what is
  on screen, and people who learn that tooltips say nothing new stop reading
  the ones that do.

---

### Cancelling

Every control that backs out of a form, dialog, inline edit or confirmation is
`CancelButton`: **outlined, warning tone, X icon**. Never write the markup by
hand — the pair of buttons at the foot of a dialog is the most copied block in
the app, and each copy is a chance for one to end up plain, grey or iconless.

The warning tone marks it as the half that discards what was typed, without the
alarm of the error tone, which belongs to deleting a record. Pass
`label="Close"` where nothing is being discarded, and `isStretched` inside a
confirmation popover where the two buttons share the row.

---

## 10. Code conventions

Write code the way a senior TypeScript developer would: clean, typed, and
boring. These apply to every project that follows this document.

### Principles: KISS and DRY

These two govern everything else in this document. When a rule below seems to
conflict with one of them, these win.

**KISS — keep it simple.** Build the simplest thing that satisfies the actual
requirement.

- No speculative generality. Do not add props, options or configuration that
  nothing asks for yet; add them when a second caller genuinely needs them.
- No abstraction layer with one caller. A wrapper that only forwards arguments
  is indirection, not design.
- Flat over nested: return early, extract helpers, avoid deep conditionals.
- If a comment is needed to explain *how* code works, simplify the code instead.
  Comments should explain *why*.
- Reach for the platform before a library, and for a library before writing your
  own.

**DRY — one source of truth.** This is the principle §1 exists to enforce.

- A pattern appearing in a second feature gets extracted into `components/`
  immediately. Do not wait for a third copy — by then the copies have drifted
  and merging them is a refactor instead of a move.
- Knowledge lives in exactly one place: status colours, column widths,
  identifier formats, breakpoints, navigation entries. A value that appears in
  two files is a bug waiting to happen.
- Copy-paste is the signal. If you are about to paste code, stop and extract it.
- Fixing a bug in one copy of a pattern means the other copies still have it.

**Where they pull against each other, DRY applies to _knowledge_, not to code
that merely looks alike.** Two blocks that resemble each other today but change
for different reasons belong apart — deduplicating them couples two things that
should move independently, and the next change has to unpick the abstraction.
Ask whether the duplicated thing is one decision or two. One decision, one
source of truth; two decisions that happen to rhyme, leave them alone.

### Naming and formatting

- `kebab-case` files and directories; `PascalCase` components and types;
  `camelCase` values; `UPPER_SNAKE` constants.
- Single quotes — double only where it avoids escaping — semicolons, 2-space
  indent, trailing commas in multiline literals, space after keywords and
  commas, and before a function declaration's parentheses.
- Functions start with a verb. Booleans read as `isX` / `hasX` / `canX`; a
  function returning nothing is named for the act it performs — `saveDraft`,
  `revokeToken` — so a call site reads as the effect it has.
- Complete words over abbreviations, except the well-known ones: `id`, `err`,
  `ctx`, `req`, `res`, `i`/`j` in loops, and standard ones like API and URL.
- **No magic numbers.** A number with meaning gets a named constant and a
  comment explaining why that value.
- **Code and documentation are written in English**, including identifiers,
  comments, commit messages and JSDoc. A codebase that mixes languages forces
  every later reader through a translation step to answer questions the code
  should answer directly, and the mix is unwinnable once it is in: renaming
  half the identifiers is a refactor nobody schedules.

### Types

- Declare types for every parameter and return value. **Never `any`** — create
  the type instead.
- Encapsulate related values in a composite type rather than passing loose
  primitives.
- `readonly` for values that do not change; `as const` for literals.
- Prefer immutability. Derive new values rather than mutating.

### Functions

- Short and single-purpose — under about 20 statements.
- Avoid nesting by returning early and extracting helpers.
- Prefer `map` / `filter` / `reduce` over hand-rolled loops with nesting.
- Arrow functions for short helpers; named functions when the body is
  substantial.
- More than two or three parameters: pass an object and return an object, with
  declared types for both.
- One level of abstraction per function.
- **No blank lines inside a function body.** A function that needs visual
  breathing room to be read is doing more than one thing — the blank line is
  marking the seam where it should be split. Extract the part after the gap and
  give it a name; the name does what the whitespace was attempting.

### React

- Arrow function components, named exports for anything shared.
- Follow the rules of hooks: top level only, from React functions only.
- `useCallback` for callbacks passed down, `useMemo` for genuinely expensive
  work — not reflexively on everything.
- Stable, meaningful `key` props. Never the array index.
- Controlled components over uncontrolled.
- Clean up in `useEffect` — timers and subscriptions must be torn down, because
  a component that unmounts mid-timeout will otherwise set state after unmount.
- Composition over inheritance; `children` and render props for flexibility.
- Extract reusable component logic into a custom hook.

### State

- Component state with `useState`; `useReducer` when transitions get complex;
  context to avoid deep prop drilling.
- Global state in one store per concern. Normalise rather than nesting deeply.
- Never merge unrelated concerns into an existing store.
- State that outlives a modal belongs in a store, not in component state — a
  dialog that cannot be dismissed still loses its contents on reload.

### Errors

- Exceptions are for the unexpected. Catch only to handle a known case or to add
  context; otherwise let a global handler deal with it.
- Validate at the boundary so inner functions can assume good input.

### Tests

Test the logic that would be expensive to get wrong: computation, formatting,
and the helpers every screen depends on. A shared helper has no owning page to
exercise it, so a change to one is felt everywhere at once or nowhere until
production.

- **Arrange–Act–Assert, in that order, with the three parts visible.** A test
  whose setup, action and assertion are interleaved reports *that* something
  broke without saying which step did it.
- **Mock at the boundary — the network, the clock, the filesystem** — and
  nothing inside it. A test that mocks the unit's own collaborators asserts the
  implementation it was given rather than the behaviour it was asked for, and
  fails on every refactor that changes nothing observable.
- **One reason to fail per test.** A test asserting four unrelated things tells
  you one of four stories and makes you read the body to find out which.
- Name the test for the behaviour, not the function: the name is what a failure
  reports, and `formatCurrency works` names no expectation.

### Documentation

- JSDoc every shared component, hook, exported helper and exported type: what it
  is, *why* it exists, and an `@example`.
- Record the non-obvious constraint. The next reader needs the reasoning, not a
  restatement of the signature.
- Comments explain *why*, never *what* — the code already says what.

### Where things go

```
src/
  app/<feature>/     page.tsx, components/, columns.tsx
  components/        shared across features — everything in §1
  hooks/             shared behaviour
  constants/         shared values; no magic numbers in pages
  interfaces/        one file per domain entity
  stores/            one store per concern
  utils/             theme composition, formatting
```

A component used by two features belongs in `components/`, not in one feature
importing across into another. **A cross-feature import of
`app/<other-feature>/…` is the signal that something needs promoting** — treat
it as a bug in the structure.

### State

One store per concern, persisted when the state should survive a reload. Do not
merge unrelated concerns into an existing store. State that outlives a modal
belongs in a store, not in component state — a dialog that cannot be dismissed
still loses its contents on reload.

---

## 11. Lazy loading

**Load what the current screen needs, and nothing else.** Every page added to a
project otherwise lands in the same bundle, so the app gets slower with each
feature even for users who never open it.

### Routes

**Every page is lazily imported.** No exceptions beyond the login screen and the
app shell, which are needed before anything can be routed.

```tsx
const SomePage = lazy(() => import('./app/some-feature/page'));
```

One `Suspense` boundary lives **inside the layout, around the router outlet**,
not around the whole app — the navigation shell should stay on screen while a
page chunk arrives, so the app never blanks out between routes.

### Always-mounted components

A component rendered by the layout on every page is in the entry bundle even if
the user never sees it. Global modals, help panels and notification drawers all
fall into this trap.

- Lazily import them, **and** gate them on the state that opens them:
  `{isOpen && <SomeModal />}`. Lazy alone is not enough — a component that is
  always rendered still fetches its chunk on every page load; it just does so
  off the critical path.
- Use `fallback={null}` for these. A spinner where a closed modal would be is
  worse than nothing.

### Heavy dependencies

Rich-text editors, charting libraries, PDF viewers and date libraries are each
large enough to dominate a bundle. They belong behind a lazy boundary, reached
only from the screen that uses them. **Check where they are imported from** — one
eager import anywhere in the shell pulls the whole library into the entry chunk.

### Deferred content within a page

- A collapsible section renders its body with `unmountOnExit`, so a page with
  many groups mounts headers rather than every control at once.
- Tabs mount the active panel only.
- A modal's body mounts when it opens, not with its parent.
- Long lists page rather than rendering every row. Where virtualisation is
  unavailable or conflicts with another requirement, cap the page size instead.

### Data

- Fetch on the screen that needs it, not in the shell.
- Load a record's detail when the detail is opened, not with the list.
- A panel that is collapsed by default has not been opened — do not fetch for it.

### Type-only imports

`import type { Thing } from 'heavy-library'` is erased at build time;
`import { Thing }` may not be, pulling the whole library in for a type. Use
`import type` whenever the import is only used in type position.

### Verifying

Check the build output after adding a feature. One oversized chunk means
something eager is pulling in what should be lazy — find it before it becomes
the baseline everyone inherits.

---

## 12. Theming

- Light and dark are both first-class. Every colour decision handles both.
- Surfaces are glassmorphic: translucent background, blur, hairline border,
  rounded corners.
- Read colours from the palette. A hard-coded value belongs in the theme files,
  or in a named constant with a comment explaining the exception — the opaque
  sticky-column backdrop is one, because a translucent surface cannot occlude.
- **Brand colours are not theme colours.** A product's logo and wordmark colours
  identify it, so they stay the same in light and dark mode and live in their
  own constants file, named. Never render a mark from a theme token: a
  deployment may restyle the theme, and the logo must not follow it.
- Spacing uses the theme scale. Fixed pixels only for genuinely fixed things
  such as icon sizes.

### Identifiers and money are set in a different face

**Anything read character by character rather than as words — an identifier, a
monetary amount, a version — is set in the monospace face with fixed-width
digits.** Body text is not.

The reason is comparison. In a proportional face `ACL-POC-001` and `ACL-POC-007`
are different widths, so a column of them does not line up and a changed digit
is hard to spot; the same is true of a column of amounts whose decimal points
wander. Fixed-width glyphs make the column scannable and a mismatch obvious,
which is exactly what someone checking a reference or an invoice is doing.

- It comes from **one named constant**, applied as a whole — the family and the
  tabular figures together. An inline `fontFamily: 'monospace'` is the drift
  this prevents: half the identifiers in the app end up in one face and half in
  another, and no one can change either.
- **Counts and measurements take the tabular figures without the monospace
  family.** They are numbers in a sentence, not references to be matched, and a
  monospace face makes ordinary prose look like code.
- A **currency symbol is not part of the figure.** It pins to the leading edge
  of the cell while the amount pins to the trailing edge, so the digits align
  regardless of how long the symbol is.

---

## 13. Release notes

Every platform publishes what changed in it. The page is the same everywhere, so
a reader moving between products does not have to learn two changelogs.

### What a release is

A release note carries a **version**, a **deployment type**, **when it shipped**,
and a body of rich text. Nothing else is required, and nothing else should be
invented per project.

- **The version is validated at entry, not on save.** It must use every place
  the project's scheme defines, and must be higher than the version it replaces.
  Say which of the two rules is unmet — a three-place version failing a format
  check looks identical to one failing the ordering check, and a disabled button
  explains neither.
- **A note belongs to one platform.** A product's changelog shows only its own
  notes, filtered by platform, or a maintenance run on one product appears in
  another's history.
- **Newest first**, always. Nobody opens a changelog to read the oldest entry.

### How it reads

- **The newest release is set apart in an `InfoPanel`** — what shipped most
  recently is the question the page is opened to answer, and a column of equally
  weighted cards makes finding it the reader's job.
- **Older notes are faded, not hidden.** Keep them comfortably legible and
  restore them on hover: the fade orders the list, it does not deprecate what it
  dims.
- **There is no byline.** Releases are published by the organisation, not by
  whoever ran the deployment. Naming a person makes an internal detail public
  and dates the note to someone who may since have left. Keep the publisher on
  the record if the API carries it; do not print it.
- The version is **identifier type** (§12), because it is compared
  character by character against another version.

### Publishing

**Release notes are written as part of completing a deployment, not as a
separate errand afterwards.** A deployment that can be completed without them
produces a changelog with holes in it, and the detail is never as fresh again.
Require them before the run can be closed.

---

## 14. Notices: banners, panels and snackbars

Three ways to tell someone something, and the choice between them is about **how
long it matters**, not how important it feels.

| | Use for | Lives |
|---|---|---|
| **Banner** | A condition that persists and must not be forgotten — an outage, a booked deployment | Above every page, until the condition ends |
| **`InfoPanel`** | The headline fact of the page being read | In the page, as long as the page |
| **Snackbar** | Something that just happened | A few seconds |

Getting this wrong is what produces interfaces nobody reads: a snackbar for a
condition that outlives it, a banner for an event that is already over.

### Banners

- **Opaque, never translucent.** The page scrolls beneath the band, and a
  warning that rows read through is not a warning.
- **The whole band is the control**, and it goes to the one place the condition
  can be acted on. A banner that reports a problem without offering the way to
  it makes the reader go looking.
- **One at a time.** Where two conditions could both show, the live one outranks
  the booked one; two bands bury the page under its own chrome.
- **Scope it to its audience** — see "Who a maintenance notice is shown to"
  (§4). This is the rule most easily lost when porting.

### Snackbars

- **One at a time, a few seconds, one position** — set centrally, never
  per-call, or the same confirmation appears in two places on two pages.
- For **something completed**: saved, cancelled, scheduled. Name the record, so
  the message still means something if it is read a moment late.
- **Never for a copy action.** A tick on the button for a moment is the whole
  confirmation; a snackbar for a copy is more ceremony than the act deserves and
  covers the page it was copied from.
- **Never for an error the form can show.** A field that can explain itself
  should, where the problem is.

---

## 15. Checklist: adding a list page

1. `FullHeightPage` shell.
2. `PageActionBar` for the toolbar, `ListPageContent` splitting the list from
   its `FiltersPanel` (§2).
3. `useFiltersVisibility` for the panel's open state; `FILTER_FIELD_SX` on each
   filter control.
4. Columns: `minWidth` from `COLUMN_MIN_WIDTH` on every one, `actions` last and
   capped at three actions plus More, shared cells for email/link/copy,
   `NumberCell` / `CurrencyCell` for figures, `StatusChipCell` for status,
   `formatEntityId` for display IDs.
5. Every date through `utils/format-date.ts` — never `toLocaleString` (§6).
6. Search matches everything the list displays, including formatted IDs.
7. `ResponsiveListView` with `renderCard` and an `emptyMessage`.
8. Mobile card on `EntityCard` using the `*Field` components.
9. `RowActionsMenu` with `View History Logs`, rendered with `HistoryDialog` (§8).
10. Confirmations per §7; an icon on every action per §9.
11. Route, navigation entry, and — only if steps 7–8 are done —
    `MOBILE_ALLOWED_PATHS`.
12. Route registered with `lazy()` per §11; check the build output for an
    oversized chunk.
13. Lint and build clean.

If a step needs a component that does not exist in this project yet, port it
from one that has it, or build it under `components/`, document it, and add it
to §1. That is how this standard grows.
