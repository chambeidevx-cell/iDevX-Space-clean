import { Box, Typography, useTheme } from '@mui/material';
import { APP_VERSION } from '@/constants/app';
import { IDEVX_LOGO, IDEVX_WORDMARK_GRADIENT, IDEVX_WORDMARK_INK } from '@/constants/brand';

/** Footer type, stepped down on compact screens along with the bar itself. */
const FOOTER_CAPTION_SIZE = { xs: '0.65rem', lg: '0.75rem' };
const FOOTER_FONT_SIZE_COMPACT = '0.65rem';

/**
 * The attribution line: the build version, then "Powered by" and the iDevX mark,
 * in one centred row.
 *
 * Only the line itself — where it sits (in the page flow, or pinned to the
 * bottom of the viewport on mobile) is the caller's, so every shell that shows
 * it renders the same mark at the same size.
 *
 * @example <Box component="footer" sx={{ display: 'flex', justifyContent: 'center' }}><AppAttribution /></Box>
 */
export const AppAttribution = () => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="caption" sx={{ color: 'text.disabled', letterSpacing: '0.05em', fontSize: FOOTER_CAPTION_SIZE }}>
        v{APP_VERSION}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: FOOTER_CAPTION_SIZE }} aria-hidden>
        |
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled', letterSpacing: '0.05em', fontSize: FOOTER_CAPTION_SIZE }}>
        Powered by
      </Typography>
      <Box
        component="a"
        href="#"
        onClick={(e: React.MouseEvent) => e.preventDefault()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          textDecoration: 'none',
          cursor: 'pointer',
          opacity: 0.6,
          transition: 'opacity 0.2s, transform 0.2s',
          '&:hover': { opacity: 1, transform: 'scale(1.05)' },
        }}
      >
        <Box
          component="img"
          src={IDEVX_LOGO}
          alt="iDevX"
          sx={{ height: { xs: 11, lg: 14 }, width: 'auto' }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: { xs: FOOTER_FONT_SIZE_COMPACT, lg: '0.75rem' },
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box component="span" sx={{ color: IDEVX_WORDMARK_INK[theme.palette.mode] }}>iDev</Box>
          <Box
            component="span"
            sx={{
              backgroundImage: IDEVX_WORDMARK_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            X
          </Box>
        </Typography>
      </Box>
    </>
  );
};
