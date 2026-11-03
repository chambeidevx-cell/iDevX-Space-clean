import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { DataGridProps, GridValidRowModel } from '@mui/x-data-grid';
import { AppDataGrid } from '@/components/data-grid/app-data-grid';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { ScrollableArea } from '@/components/scrollable-area';

interface ResponsiveListViewProps<Row extends GridValidRowModel> extends DataGridProps<Row> {
  rows: readonly Row[];
  /** Card shown per row on mobile. Omit only for a desktop-only table. */
  renderCard?: (row: Row) => ReactNode;
  /** Shown in place of the list when nothing matches. */
  emptyMessage?: string;
}

/**
 * A list rendered as a table on desktop and as cards on mobile, because a grid
 * with horizontal scroll is unusable on a phone.
 *
 * Any prop of `AppDataGrid` passes straight through, so pages keep one element
 * for both layouts rather than branching on the breakpoint themselves.
 *
 * @example
 * <ResponsiveListView
 *   rows={visibleRows}
 *   columns={columns}
 *   renderCard={(row) => <UserCard user={row} />}
 *   emptyMessage="No users match the current filters."
 * />
 */
export const ResponsiveListView = <Row extends GridValidRowModel>({
  rows,
  renderCard,
  emptyMessage = 'No records match the current filters.',
  ...gridProps
}: ResponsiveListViewProps<Row>) => {
  const isMobile = useIsMobile();

  if (!isMobile || !renderCard) {
    return <AppDataGrid rows={rows} {...gridProps} />;
  }

  return (
    <ScrollableArea>
      <Stack spacing={1.5} sx={{ pb: 1 }}>
        {rows.map((row) => renderCard(row))}
        {rows.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
            {emptyMessage}
          </Typography>
        )}
      </Stack>
    </ScrollableArea>
  );
};
