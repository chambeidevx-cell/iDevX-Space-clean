import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import { PAGE_TITLES } from '@/constants/navigation';
import { useIsMobile } from '@/hooks/use-is-mobile';

/**
 * Sits above page content but below the app's own chrome (drawers, modals,
 * snackbars), so the surface never covers a dialog.
 */
const STICKY_Z_INDEX = 2;

interface StickySurfaceProps {
  /**
   * The surface's contents. Pass a function to receive whether the surface has
   * detached — useful for dropping controls that do not earn their place once
   * the bar is a floating strip.
   */
  children: ReactNode | ((isStuck: boolean) => ReactNode);
  /** Applied to the surface itself — its spacing against the page. */
  sx?: SxProps<Theme>;
  /** Applied to the row holding `children`, for the caller's own layout. */
  contentSx?: SxProps<Theme>;
}

/**
 * A bar that stays in reach while the page scrolls, and frosts into a defined
 * surface once it detaches from the top of the content.
 *
 * Every sticky bar in the app uses this, so they all detach the same way. They
 * previously did not: one frosted on scroll and the others stayed permanently
 * transparent, which read as different components behaving inconsistently
 * rather than one pattern.
 *
 * Detachment is detected with a zero-height sentinel above the bar rather than
 * by watching scroll position — `position: sticky` gives no event of its own,
 * and a scroll listener would have to know which element scrolls, which differs
 * between a page that scrolls itself and a grid that scrolls internally.
 *
 * At rest the surface is transparent and unpadded, so it reads as part of the
 * page; it takes on a background only once content is actually passing beneath
 * it and the controls would otherwise be read through.
 *
 * @example
 * <StickySurface sx={{ mb: -2 }}>
 *   <ListPageToolbar … />
 * </StickySurface>
 */
export const StickySurface = ({ children, sx, contentSx }: StickySurfaceProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  /**
   * Once the heading has scrolled away, the bar says which page this is — but
   * only on tablet and below, where there is no sidebar keeping that answer on
   * screen.
   */
  const stuckTitle = isMobile && isStuck ? PAGE_TITLES[pathname] : undefined;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Box ref={sentinelRef} sx={{ height: 0 }} />
      <Box
        sx={[
          {
            position: 'sticky',
            top: 0,
            zIndex: STICKY_Z_INDEX,
            borderRadius: 2,
            border: '1px solid',
            background: isStuck
              ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(8,12,20,0.70)' : 'rgba(255,255,255,0.80)')
              : 'transparent',
            borderColor: isStuck
              ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)')
              : 'transparent',
            backdropFilter: isStuck ? 'blur(20px)' : 'none',
            py: isStuck ? 1 : 0,
            px: isStuck ? 1.5 : 0,
            transition: 'background 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease, padding 0.2s ease',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {stuckTitle && (
          <Typography
            sx={{
              mb: 1,
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {stuckTitle}
          </Typography>
        )}
        <Box sx={contentSx}>
          {typeof children === 'function' ? children(isStuck) : children}
        </Box>
      </Box>
    </>
  );
};
