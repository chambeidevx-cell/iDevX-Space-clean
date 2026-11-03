import { Suspense, lazy, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, useTheme } from '@mui/material';
import { Sidebar } from './sidebar';
import { MOBILE_BOTTOM_NAV_HEIGHT, MobileBottomNav } from './mobile-bottom-nav';
import { DesktopOnlyNotice } from './desktop-only-notice';
import { MOBILE_CORNER_ACTIONS_BAND, FloatingCornerActions } from './floating-corner-actions';
import { PageLoader } from './page-loader';
import { PageHeader } from './page-header';
import { MobileBrandHeader } from './brand/mobile-brand-header';
import { AppAttribution } from './brand/app-attribution';
import { CONTENT_GUTTER_SX, CONTENT_PADDING_Y, FOOTER_BOTTOM_GAP, FOOTER_HEIGHT, FOOTER_HEIGHT_COMPACT, MOBILE_FOOTER_BAND, SAFE_AREA_BOTTOM, SAFE_AREA_TOP } from '@/constants/layout';
import { isMobileAllowedPath } from '@/constants/navigation';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useSidebarStore } from '@/stores/sidebar-store';
import { MaintenanceBanner } from './maintenance-banner';

/**
 * The helpdesk lives here so it is reachable from anywhere, but it is not
 * needed to render a page — and it pulls in the rich-text editor, which is one
 * of the heaviest dependencies in the app. Loading it on demand keeps the
 * editor out of the entry chunk.
 */
const HelpdeskModal = lazy(() => import('@/components/modals/helpdesk-modal'));

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;
const SIDEBAR_GAP = 8;

export const BaseLayout = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const { isCollapsed } = useSidebarStore();
  const [helpdeskOpen, setHelpdeskOpen] = useState(false);
  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
  const contentWidth = `calc(100vw - ${drawerWidth}px - ${SIDEBAR_GAP}px)`;
  const isBlockedOnMobile = isMobile && !isMobileAllowedPath(pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isMobile && <Sidebar onHelpdeskOpen={() => setHelpdeskOpen(true)} />}
      <Box
        component="main"
        sx={{
          width: isMobile ? '100vw' : contentWidth,
          marginLeft: isMobile ? 0 : `${SIDEBAR_GAP}px`,
          // Reserve the attribution's band, and only that. The scroll area then
          // ends exactly where the footer begins — as on desktop, where the two
          // are stacked and nothing passes behind the attribution. The bar's
          // own clearance is *not* reserved here: it floats over the page, so
          // it belongs inside the scroll container (below) instead.
          paddingBottom: isMobile ? `calc(${MOBILE_FOOTER_BAND}px + ${SAFE_AREA_BOTTOM})` : 0,
          // The viewport paints under the dynamic island or notch, so the band
          // it occupies is reserved here — once, above the banner and the scroll
          // area both, rather than by each of them separately.
          paddingTop: isMobile ? SAFE_AREA_TOP : 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          background: 'transparent',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <MaintenanceBanner />
        <Box ref={contentRef} sx={{ flex: 1, overflowY: 'auto' }}>
          {/* Outside the container, so a full-height page's gutter bleed does
              not pull itself up over them. */}
          {isMobile && <MobileBrandHeader />}
          {isMobile && !isBlockedOnMobile && <PageHeader />}
          <Container
            maxWidth={false}
            sx={{
              py: CONTENT_PADDING_Y,
              ...CONTENT_GUTTER_SX,
              // Clearance for the furniture floating over the scroll area: the
              // page runs beneath it, but its last content can still be
              // scrolled clear. Whichever of the two reaches higher wins — the
              // bar spans the width, the corner stack rises further on one
              // side, and reserving only the bar's band would leave the final
              // row of content permanently under the helpdesk button. Both are
              // measured from the footer's band, which the scroll container
              // already stops at, so no safe-area inset here.
              ...(isMobile && {
                pb: `${Math.max(MOBILE_BOTTOM_NAV_HEIGHT, MOBILE_CORNER_ACTIONS_BAND)}px`,
              }),
            }}
          >
            {isBlockedOnMobile
              ? <DesktopOnlyNotice />
              : <Suspense fallback={<PageLoader />}><Outlet /></Suspense>}
          </Container>
        </Box>
        <Box
          component="footer"
          sx={{
            ...CONTENT_GUTTER_SX,
            minHeight: { xs: FOOTER_HEIGHT_COMPACT, lg: FOOTER_HEIGHT },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            flexShrink: 0,
            // On mobile the bar floats above the attribution rather than over
            // it, so the footer leaves the page flow and pins to the very
            // bottom of the viewport. Nothing scrolls underneath it: `main`
            // already reserves the whole band.
            ...(isMobile && {
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              // Clears the home indicator, and keeps the text off the very
              // bottom edge of the screen rather than flush against it.
              minHeight: MOBILE_FOOTER_BAND,
              paddingBottom: `calc(${FOOTER_BOTTOM_GAP}px + ${SAFE_AREA_BOTTOM})`,
              zIndex: theme.zIndex.appBar,
              // No background of its own, as on desktop: `main` reserves this
              // band, so the page stops above the attribution rather than
              // scrolling behind it, and the body's own backdrop shows through.
              // Only the bar overlaps the content.
            }),
          }}
        >
          <AppAttribution />
        </Box>
      </Box>
      {isMobile && <MobileBottomNav />}
      {isMobile && (
        <FloatingCornerActions
          scrollRef={contentRef}
          onHelpdeskOpen={() => setHelpdeskOpen(true)}
        />
      )}
      <Suspense fallback={null}>
        {helpdeskOpen && <HelpdeskModal open onClose={() => setHelpdeskOpen(false)} />}
      </Suspense>
    </Box>
  );
};
