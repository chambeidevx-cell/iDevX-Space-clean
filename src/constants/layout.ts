/**
 * The strips a device reserves around the edges of its screen, and 0 where it
 * reserves none: the home indicator along the bottom, the dynamic island or
 * notch at the top, and — in landscape, or on a phone with curved glass — the
 * sides.
 *
 * **Anything pinned to an edge must add the inset for that edge**, or it renders
 * underneath the hardware, where the OS draws over it and takes the swipes
 * before the page sees them. Content that merely sits near an edge needs it too:
 * a curved screen bends the last few millimetres of the page away from the
 * reader.
 *
 * They are CSS `env()` expressions rather than numbers because only the browser
 * knows the values, so they have to be composed with `calc()`. All four read 0
 * unless `viewport-fit=cover` is set on the viewport meta tag in `index.html`;
 * the tag and the insets are one change — the tag alone pushes content under the
 * hardware, and the insets alone silently do nothing.
 */
export const SAFE_AREA_TOP = 'env(safe-area-inset-top, 0px)';
export const SAFE_AREA_BOTTOM = 'env(safe-area-inset-bottom, 0px)';
export const SAFE_AREA_LEFT = 'env(safe-area-inset-left, 0px)';
export const SAFE_AREA_RIGHT = 'env(safe-area-inset-right, 0px)';

/**
 * Gutters around page content, in pixels.
 *
 * The breakpoint key below must stay in step with `BOTTOM_NAV_BREAKPOINT`, so
 * the layout switches gutters at the same width it switches navigation.
 */
const COMPACT_GUTTER = 16;
const WIDE_GUTTER = 24;

/** Vertical padding is the same at every width — content sits close to the top. */
const PADDING_Y = 2;

/**
 * Gutters for page content, as an sx fragment to spread — not a value to assign
 * to `px`.
 *
 * The two sides are set separately because their safe-area insets differ: a
 * phone held in landscape reports a large inset on the notch's side and none on
 * the other, and `px` can only give both the same figure. Spreading also fails
 * loudly if someone writes `px: CONTENT_GUTTER_SX`, where a single value would
 * have silently applied nothing.
 *
 * @example <Box sx={{ ...CONTENT_GUTTER_SX, py: CONTENT_PADDING_Y }}>
 */
export const CONTENT_GUTTER_SX = {
  pl: { xs: `calc(${COMPACT_GUTTER}px + ${SAFE_AREA_LEFT})`, lg: `${WIDE_GUTTER}px` },
  pr: { xs: `calc(${COMPACT_GUTTER}px + ${SAFE_AREA_RIGHT})`, lg: `${WIDE_GUTTER}px` },
};

export const CONTENT_PADDING_Y = PADDING_Y;

/**
 * Negative margin that cancels the gutters, letting a full-bleed page reclaim
 * them. Derived from the same value so the two cannot drift apart.
 *
 * **Desktop only.** On tablet and below a page keeps its gutters: they carry the
 * safe-area insets, and giving back the space a curved edge or a notch occupies
 * puts content where the device will cover it.
 */
export const CONTENT_BLEED_X = `-${WIDE_GUTTER}px`;
export const CONTENT_BLEED_Y = -PADDING_Y;

/**
 * Height reserved for the "Powered by" footer. Compact screens get a shorter
 * one so the content area keeps as much vertical space as possible.
 *
 * `FullHeightPage` subtracts this to size itself, and the footer applies it as
 * its own minimum — both read from here so the reservation and the rendered
 * height can never disagree and leave a gap or a clipped page.
 */
export const FOOTER_HEIGHT = 32;
export const FOOTER_HEIGHT_COMPACT = 22;

/**
 * Breathing room below the attribution on mobile, between it and the safe-area
 * inset. Without it the text sits hard against the bottom edge of the screen.
 */
export const FOOTER_BOTTOM_GAP = 8;

/**
 * Total height of the mobile attribution band — the footer plus the gap under
 * it, excluding the safe-area inset. The bottom navigation sits directly on top
 * of this band, so the two must be read from one value.
 */
export const MOBILE_FOOTER_BAND = FOOTER_HEIGHT_COMPACT + FOOTER_BOTTOM_GAP;
