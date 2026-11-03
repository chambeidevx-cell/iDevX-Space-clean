import { useMediaQuery, useTheme } from '@mui/material';
import { BOTTOM_NAV_BREAKPOINT } from '@/constants/navigation';

/**
 * True when the viewport is tablet-sized or smaller — the same breakpoint that
 * swaps the sidebar for the bottom navigation bar. Use it to switch a page to
 * its mobile presentation (cards instead of grids, stacked filters, and so on).
 *
 * @example const isMobile = useIsMobile();
 */
export const useIsMobile = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(BOTTOM_NAV_BREAKPOINT));
};
