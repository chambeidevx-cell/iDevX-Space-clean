/**
 * Minimum widths for grid columns, grouped by the kind of content a column
 * holds. Flex columns shrink until they hit these floors, at which point the
 * table scrolls sideways instead of clipping cells — the sticky first and
 * action columns keep identity and actions in view while it does.
 *
 * Values allow for the cell's padding and the column header, which renders
 * uppercase and letter-spaced and is often wider than the data beneath it.
 *
 * @example { field: 'email', headerName: 'Work Email', flex: 1.5, minWidth: COLUMN_MIN_WIDTH.email }
 */
/**
 * Type size inside the filter panel. Filters are a supporting control rather
 * than content, so they are set below body copy — it keeps the panel narrow and
 * lets the table keep the width.
 */
export const FILTER_FONT_SIZE = '0.75rem';

/** Padding inside a filter control, tighter than MUI's `small` density. */
const FILTER_INPUT_PADDING_Y = '5.5px';
const FILTER_INPUT_PADDING_X = '10px';

/**
 * Styling for a control inside `FiltersPanel`. Filters live in a column beside
 * the list, so every control spans it — a filter reads the same on every page
 * regardless of how many that page has.
 *
 * Sized below MUI's `small` density: filters are a supporting control, and a
 * shorter field fits more of them in the panel without scrolling.
 *
 * Styles the field only. The dropdown renders in a portal that `sx` cannot
 * reach — `FilterSelect` sizes that through `MenuProps`, which is why filters
 * should go through it rather than applying this directly.
 *
 * The label transforms are part of the same change, not decoration — MUI
 * positions the floating label for its own padding, so shrinking the field
 * without them leaves the resting label off-centre and the shrunk one drifting
 * away from the notch.
 */
export const FILTER_FIELD_SX = {
  width: '100%',
  '& .MuiInputBase-root': { fontSize: FILTER_FONT_SIZE },
  '& .MuiInputBase-input': {
    paddingTop: FILTER_INPUT_PADDING_Y,
    paddingBottom: FILTER_INPUT_PADDING_Y,
    paddingLeft: FILTER_INPUT_PADDING_X,
  },
  '& .MuiInputLabel-root': {
    fontSize: FILTER_FONT_SIZE,
    transform: `translate(${FILTER_INPUT_PADDING_X}, ${FILTER_INPUT_PADDING_Y}) scale(1)`,
  },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    transform: `translate(${FILTER_INPUT_PADDING_X}, -7px) scale(0.85)`,
  },
  '& .MuiSelect-icon': { fontSize: 18 },
} as const;

export const COLUMN_MIN_WIDTH = {
  /** Short codes and tallies — versions, counts. */
  compact: 110,
  /** Status chips — "Active", "Processing". */
  status: 130,
  /** An editable chip — the status width plus room for the dropdown caret. */
  select: 160,
  /** Single-line labels — roles, positions, departments, sources. */
  label: 150,
  /** Identifiers — "IDVX-PLT-00001". */
  identifier: 170,
  /** Dates, with or without a time. */
  date: 170,
  /** Currency amounts and other right-aligned figures. */
  amount: 140,
  /** A person's name as plain text — "Martinez, Patricia M." without clipping. */
  person: 180,
  /** Names rendered beside an avatar. */
  name: 210,
  /** Email addresses. */
  email: 240,
  /** URLs and long free text. */
  wide: 260,
  /** Icon strips — fits four compact buttons plus the cell's padding. */
  actions: 150,
} as const;
