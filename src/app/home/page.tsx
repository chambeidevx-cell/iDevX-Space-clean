import { Box, Stack, Typography } from '@mui/material';
import { ProductLockup } from '@/components/brand/product-lockup';
import { AppAttribution } from '@/components/brand/app-attribution';
import { CONTENT_GUTTER_SX, CONTENT_PADDING_Y, FOOTER_BOTTOM_GAP, FOOTER_HEIGHT, FOOTER_HEIGHT_COMPACT, SAFE_AREA_BOTTOM, SAFE_AREA_TOP } from '@/constants/layout';
import { IDEVX_SPACE_PLATFORM_NAME } from '@/constants/app';

const LOCKUP_MARK_HEIGHT = 32;
const LOCKUP_FONT_SIZE = 20;
const HERO_MAX_WIDTH = 640;

/**
 * The landing page — public, and the only page in the app.
 *
 * It stands on its own rather than inside `BaseLayout`: there is no sign-in and
 * nothing to navigate to, so the shell's sidebar and bottom bar would have
 * nothing to offer. It keeps the shell's furniture that still applies — the
 * product lockup at the top, the attribution at the foot, the content gutters,
 * and the safe-area insets top and bottom (DESIGN-RULES §3).
 */
const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        pt: SAFE_AREA_TOP,
        pb: `calc(${FOOTER_BOTTOM_GAP}px + ${SAFE_AREA_BOTTOM})`,
      }}
    >
      <Box component="header" sx={{ ...CONTENT_GUTTER_SX, py: CONTENT_PADDING_Y, display: 'flex' }}>
        <ProductLockup markHeight={LOCKUP_MARK_HEIGHT} fontSize={LOCKUP_FONT_SIZE} />
      </Box>
      <Stack
        component="main"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ ...CONTENT_GUTTER_SX, flex: 1, textAlign: 'center' }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
          Welcome to {IDEVX_SPACE_PLATFORM_NAME}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: HERO_MAX_WIDTH }}>
          Something new is taking shape here. Check back soon.
        </Typography>
      </Stack>
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
        }}
      >
        <AppAttribution />
      </Box>
    </Box>
  );
};

export default HomePage;
