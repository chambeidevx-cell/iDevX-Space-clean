import { ReactNode, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface ScrollableAreaProps {
  children: ReactNode;
  /**
   * Scrolls back to the top whenever this changes — the page number of a paged
   * list, say. A new page that opens halfway down starts the reader in the
   * middle of records they have not seen.
   */
  resetKey?: string | number;
}

/**
 * Content that scrolls within the page rather than scrolling the page itself.
 *
 * **Desktop only in effect.** It carries no back-to-top button of its own: on
 * tablet and below `FullHeightPage` is auto-height, so this region grows instead
 * of scrolling and the page scrolls behind it — which is what the layout's
 * corner stack is already watching. A button here would duplicate that one, and
 * duplicate the helpdesk button stacked beneath it.
 *
 * `minHeight: 0` is what allows it to shrink inside a flex column; without it a
 * flex child refuses to go below its content height and scrolls the page
 * instead.
 *
 * @example
 * <ScrollableArea>
 *   <Stack spacing={1.5}>{cards}</Stack>
 * </ScrollableArea>
 */
export const ScrollableArea = ({ children, resetKey }: ScrollableAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  return (
    <Box ref={scrollRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {children}
    </Box>
  );
};
