import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';

interface ListPageContentProps {
  /** The list itself — usually a `ResponsiveListView`. */
  children: ReactNode;
  /** A `FiltersPanel`, rendered beside the list. */
  filters?: ReactNode;
}

/**
 * Splits a list page into the list and its filter panel, side by side.
 *
 * The list takes the remaining width, so opening and closing the filters
 * reflows the table rather than overlaying it — nothing is hidden behind the
 * panel.
 *
 * `minWidth: 0` on the list is what lets the table shrink: without it a flex
 * child refuses to go below its content width and the panel is pushed off the
 * edge instead.
 *
 * @example
 * <ListPageContent filters={<FiltersPanel …>…</FiltersPanel>}>
 *   <ResponsiveListView rows={rows} columns={columns} />
 * </ListPageContent>
 */
export const ListPageContent = ({ children, filters }: ListPageContentProps) => (
  <Stack direction="row" spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
    {filters}
  </Stack>
);
