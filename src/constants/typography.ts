/**
 * Font for values that are read character by character rather than as words —
 * identifiers and money.
 *
 * A proportional font makes `ACL-POC-001` and `ACL-POC-007` different widths,
 * so a column of them will not line up and a changed digit is harder to spot.
 * Fixed-width glyphs keep them aligned and comparable down the column.
 */
export const MONO_FONT_FAMILY = 'monospace';

/**
 * Applied to identifier and money text: the monospace family plus fixed-width
 * digits, so decimal points and digit positions align down a column.
 *
 * @example <Typography sx={{ ...MONO_TEXT_SX }}>{pocId}</Typography>
 */
export const MONO_TEXT_SX = {
  fontFamily: MONO_FONT_FAMILY,
  fontVariantNumeric: 'tabular-nums',
} as const;
