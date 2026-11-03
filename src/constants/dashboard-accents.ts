/**
 * Accent colours for dashboard cards.
 *
 * Deliberately outside the theme palette. Theme colours carry meaning —
 * `primary` is the brand, `error` is destructive — and reusing them on a
 * dashboard makes unrelated figures look related. These exist only to tell
 * cards apart at a glance, so each is used **once per page**.
 *
 * They also stay clear of the four platform colours in `PLATFORMS`, which
 * identify a specific platform wherever they appear. A stat card in Client
 * Portal blue would read as being about Client Portal.
 *
 * Vibrant and fully saturated, never pastel and never muted. They are used as
 * a 3px rail across the top of a card, sitting on a near-black surface: a
 * washed-out tint disappears into it, and a dark one has nothing to separate it
 * from the background either. Pure, luminous hue is what makes the rail read.
 *
 * Pastel and dark are two ways of failing the same test — both lose the edge.
 * Keep any colour added here at comparable saturation and lightness (roughly
 * the 400–500 step of a standard ramp), so no single card dulls or blazes next
 * to the rest.
 *
 * Add a colour when a page needs a thirteenth card, rather than repeating one.
 */
export const DASHBOARD_ACCENTS = {
  sky: '#38BDF8',
  teal: '#2DD4BF',
  violet: '#A855F7',
  amber: '#F97316',
  indigo: '#6366F1',
  cyan: '#22D3EE',
  magenta: '#D946EF',
  slate: '#94A3B8',
  green: '#34D399',
  crimson: '#EF4444',
  olive: '#A3E635',
  bronze: '#EAB308',
} as const;

export type DashboardAccent = keyof typeof DASHBOARD_ACCENTS;
