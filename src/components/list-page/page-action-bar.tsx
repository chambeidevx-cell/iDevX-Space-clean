import { ReactNode } from 'react';
import { Stack } from '@mui/material';
import { StickySurface } from '@/components/sticky-surface';

interface PageActionBarProps {
  /** Usually a `ListPageToolbar` and the page's `FiltersPanel`. */
  children: ReactNode;
}

/**
 * Keeps a page's actions — search, filters, the primary button — in reach while
 * the content below scrolls. Without this the controls scroll away exactly when
 * a long list makes them most useful.
 *
 * Built on `StickySurface`, so it detaches exactly like every other sticky bar
 * in the app: transparent while it sits in the page, frosting into a defined
 * surface once content starts passing beneath it. Its own padding comes from
 * there too — at rest the bar needs none, since nothing is sliding under it yet.
 *
 * @example
 * <PageActionBar>
 *   <ListPageToolbar … />
 *   <FiltersPanel isOpen={isFiltersVisible}>…</FiltersPanel>
 * </PageActionBar>
 */
export const PageActionBar = ({ children }: PageActionBarProps) => (
  // The page shell spaces its children by 2; the negative margin pulls most of
  // that back, because the bar and the list it controls belong together and a
  // wide gap wastes the little vertical room a compact screen has.
  <StickySurface sx={{ mb: -2 }}>
    <Stack spacing={1.5}>{children}</Stack>
  </StickySurface>
);
