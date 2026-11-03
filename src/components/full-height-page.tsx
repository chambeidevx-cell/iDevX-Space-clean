import { ReactNode } from 'react';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { CONTENT_BLEED_X, CONTENT_BLEED_Y, FOOTER_HEIGHT } from '@/constants/layout';
import { BOTTOM_NAV_BREAKPOINT } from '@/constants/navigation';

interface FullHeightPageProps {
  children: ReactNode;
}

/**
 * Page shell for screens whose content fills the viewport — typically a
 * `DataGrid` that scrolls internally rather than with the page.
 *
 * **Only on desktop.** On tablet and below the page scrolls normally instead,
 * for two reasons. The grid is not there to lock to: those lists render as
 * cards through `ResponsiveListView`, which has no need of a fixed height. And
 * locking the viewport leaves nothing to scroll at page level, so the heading
 * can never scroll away and the action bar can never detach — the page ends up
 * a stack of permanently pinned furniture above a small scrolling window, which
 * is both cramped and inconsistent with every other page.
 *
 * @example <FullHeightPage><Toolbar /><AppDataGrid rows={rows} columns={columns} /></FullHeightPage>
 */
export const FullHeightPage = ({ children }: FullHeightPageProps) => {
  const theme = useTheme();
  const hasBottomNav = useMediaQuery(theme.breakpoints.down(BOTTOM_NAV_BREAKPOINT));

  return (
    <Stack
      spacing={2}
      sx={{
        height: hasBottomNav ? 'auto' : `calc(100vh - ${FOOTER_HEIGHT}px)`,
        // The gutters are reclaimed on desktop only. Below the breakpoint they
        // carry the device's safe-area insets, and a page that bleeds them away
        // puts its own edges under a curved screen or a landscape notch — so
        // there the container's gutters are kept and nothing is re-applied.
        mx: hasBottomNav ? 0 : CONTENT_BLEED_X,
        mt: CONTENT_BLEED_Y,
        // Scrolling normally, the page keeps the container's bottom padding —
        // that is the floating bar's clearance, and bleeding it away would put
        // the last card underneath the bar.
        mb: hasBottomNav ? 0 : CONTENT_BLEED_Y,
        px: hasBottomNav ? 0 : 2,
        pt: 2,
        pb: 1,
        minHeight: 0,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Stack>
  );
};
