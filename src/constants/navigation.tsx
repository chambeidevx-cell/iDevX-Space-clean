import { HomeOutlined as HomeOutlinedIcon } from '@mui/icons-material';
import { Breakpoint } from '@mui/material';
import { MenuItem, NavEntry } from '@/interfaces/menu';

/**
 * Full navigation tree, shared by the desktop sidebar and the mobile
 * "More" sheet so both stay in sync.
 */
export const MENU_ITEMS: NavEntry[] = [
  {
    title: 'Home Page',
    icon: <HomeOutlinedIcon fontSize="small" />,
    path: '/',
  },
];

/**
 * Pages that head themselves and want no heading added above them.
 *
 * The home page is the case this exists for: it opens with its own greeting and
 * summary, so a title on top of that would say the same thing twice before any
 * content.
 */
const PAGES_WITHOUT_HEADING = new Set(['/']);

/**
 * What a page calls itself, by path — the name shown at the top of it on tablet
 * and below, and in the action bar once that heading has scrolled away.
 *
 * The name and nothing else. A sentence introducing the page spends the most
 * valuable rows on a phone saying what the operator already knows by the time
 * they have navigated to it, and it is read once and then scrolled past every
 * visit after.
 *
 * Built from {@link MENU_ITEMS} so a page named once is named everywhere, plus
 * the pages reachable without a nav entry of their own. Entries that only group
 * children contribute nothing: they have no page to head. A path absent here
 * gets no heading, which is how {@link PAGES_WITHOUT_HEADING} opts out.
 */
export const PAGE_TITLES: Record<string, string> = (() => {
  const titles: Record<string, string> = {};
  const add = (item: MenuItem) => {
    if (!item.children?.length && !PAGES_WITHOUT_HEADING.has(item.path)) {
      titles[item.path] = item.title;
    }
    item.children?.forEach(add);
  };
  MENU_ITEMS.forEach((entry) => {
    if (!('group' in entry)) add(entry);
  });
  return titles;
})();

/**
 * Below this breakpoint the sidebar is replaced by the bottom navigation bar.
 * `lg` (under 1200px) covers phones and every common tablet size, including
 * iPad landscape (1024px) and iPad Pro (1194px).
 */
export const BOTTOM_NAV_BREAKPOINT: Breakpoint = 'lg';

/**
 * Paths whose pages have a responsive layout and therefore stay reachable on
 * tablet and below. Everything else is dropped from the mobile navigation and
 * renders the desktop-only notice when opened directly by URL.
 */
export const MOBILE_ALLOWED_PATHS = [
  '/',
] as const;

/** Whether `path` is one of the pages that stay available on mobile. */
export const isMobileAllowedPath = (path: string): boolean =>
  MOBILE_ALLOWED_PATHS.some((allowed) => allowed === path);

/**
 * The mobile bottom bar holds at most this many slots, the last of which is
 * always "More" — so only `MAX_BOTTOM_NAV_SLOTS - 1` direct links ever show.
 */
export const MAX_BOTTOM_NAV_SLOTS = 5;

/**
 * Direct links pinned to the mobile bottom bar, in order. Anything beyond
 * `MAX_BOTTOM_NAV_SLOTS - 1` entries is reachable through "More" instead.
 *
 * **Once there are four direct links, Home sits in the middle slot.** With
 * "More" always taking the last slot, four direct links put Home third of five
 * — the centre of the bar and the easiest point to hit one-handed, which is
 * where the page people return to most belongs. Keep Home at index 2 then.
 *
 * Every path here must also be in `MOBILE_ALLOWED_PATHS`, or a prime slot leads
 * to the desktop-only notice.
 *
 * **Titles here are deliberately shorter than the sidebar's.** The bar labels
 * the active slot underneath its disc, in a space narrower than one slot, so
 * "User Management" would arrive truncated. These are the names that fit.
 */
export const MOBILE_PRIMARY_NAV: MenuItem[] = [
  {
    title: 'Home',
    icon: <HomeOutlinedIcon />,
    path: '/',
  },
];
