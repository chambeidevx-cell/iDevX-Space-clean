/**
 * ─── iDevX Space logo & wordmark colour palette ──────────────────────────────
 *
 * The official colours of the iDevX Space logo and the "iDevX Space" name. This file is the
 * single source for them.
 *
 * These are **brand** colours, not theme colours. They identify the product, so
 * they are identical in light and dark mode and must not be swapped for palette
 * tokens — `primary.main` is iDevX orange and belongs to the theme, which a
 * deployment may restyle. Anything that renders the logo or the wordmark reads
 * from here.
 *
 * Add a colour only if it is genuinely part of the logo. For interface colour,
 * use the MUI theme.
 */

/** Deep Space — the logo's background; the darkest value in the mark. */
const DEEP_SPACE = '#0B0F14';
/** Royal Blue — the deepest blue in the mark's gradient. */
const ROYAL_BLUE = '#1048C0';
/** Electric Blue — the mid blue. */
const ELECTRIC_BLUE = '#0080F0';
/** Cosmic Cyan — the lightest blue, where the mark catches the light. */
const COSMIC_CYAN = '#10B8FF';
/** Solar Orange — the accent, shared with the iDevX mark. */
const SOLAR_ORANGE = '#FF7A18';
/** The two ends of the iDevX wordmark's gradient — the company mark, not iDevX Space's. */
const IDEVX_BLUE = '#3B82F6';
const IDEVX_VIOLET = '#8B5CF6';

/**
 * The iDevX Space logo palette, by name.
 *
 * @example sx={{ color: IDEVX_SPACE_PALETTE.cosmicCyan }}
 */
export const IDEVX_SPACE_PALETTE = {
  deepSpace: DEEP_SPACE,
  royalBlue: ROYAL_BLUE,
  electricBlue: ELECTRIC_BLUE,
  cosmicCyan: COSMIC_CYAN,
  solarOrange: SOLAR_ORANGE,
} as const;

export type IdevxSpacePaletteColor = keyof typeof IDEVX_SPACE_PALETTE;

/**
 * Gradient for the "iDevX Space" wordmark, running the logo's blues into its orange
 * accent.
 *
 * Built from {@link IDEVX_SPACE_PALETTE} so the wordmark and the mark beside it stay
 * the same colours. Deep Space is deliberately absent: it is the palette's
 * background colour, and including it would flatten one end of the wordmark
 * against a dark surface.
 *
 * Applying it needs the full background-clip set — `backgroundImage`, both the
 * prefixed and unprefixed `background-clip: text`, a transparent fill, and a
 * block display — or it paints as a filled box behind the word instead of
 * through the letters.
 *
 * @example
 * <span
 *   style={{
 *     backgroundImage: IDEVX_SPACE_WORDMARK_GRADIENT,
 *     WebkitBackgroundClip: 'text',
 *     backgroundClip: 'text',
 *     WebkitTextFillColor: 'transparent',
 *     color: 'transparent',
 *     display: 'inline-block',
 *   }}
 * >
 *   iDevX Space
 * </span>
 */
export const IDEVX_SPACE_WORDMARK_GRADIENT = `linear-gradient(135deg, ${ROYAL_BLUE} 0%, ${ELECTRIC_BLUE} 35%, ${COSMIC_CYAN} 60%, ${SOLAR_ORANGE} 100%)`;

/**
 * Gradient for the "X" in the iDevX wordmark.
 *
 * The company's mark, not the product's — so it is a different gradient from
 * {@link IDEVX_SPACE_WORDMARK_GRADIENT} and must not be substituted for it. Both
 * appear side by side in the lockup, which is the whole reason they are
 * distinct.
 *
 * Applying it needs the same full background-clip set as the iDevX Space wordmark.
 */
export const IDEVX_WORDMARK_GRADIENT = `linear-gradient(135deg, ${IDEVX_BLUE}, ${IDEVX_VIOLET})`;

/**
 * Ink for the "iDev" in the iDevX wordmark: black on a light surface, white on
 * a dark one.
 *
 * The one place a brand value is allowed to differ between the themes. It is
 * not a colour choice — the letters carry no colour of their own and have to
 * stay legible against whichever surface they sit on — so it does not breach
 * the rule that brand colours are identical in both modes.
 */
export const IDEVX_WORDMARK_INK = { light: '#000000', dark: '#FFFFFF' } as const;

/**
 * The iDevX Space mark — the iDevX logo — served from `public/`.
 *
 * A path rather than an import: the same value is stored against a company
 * record once uploads replace it, so both cases are plain strings the UI can
 * render without caring which it has.
 */
export const IDEVX_SPACE_LOGO = '/idevx-new-logo.png';

/** The iDevX mark — the company behind iDevX Space, served from `public/`. */
export const IDEVX_LOGO = '/idevx-new-logo.png';

/**
 * The company behind the product, in full.
 *
 * One constant because the same name is read in several unrelated places — the
 * house account in the client list, who a release is published as, the company
 * a fresh install starts configured for — and three literals of a company's own
 * name is three chances for one of them to keep the old one after a rename.
 *
 * It is **not** the same as the wordmark. The mark is the short form the brand
 * is drawn as; this is the name the organisation is called. Render the mark
 * where the brand belongs and this where a name belongs.
 */
export const COMPANY_NAME = 'iDevX Space';

/**
 * Image a company falls back to for its logo and favicon until it uploads its
 * own.
 */
export const DEFAULT_COMPANY_LOGO = IDEVX_SPACE_LOGO;
