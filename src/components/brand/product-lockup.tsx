import { Box, Stack, Typography } from '@mui/material';
import { IDEVX_SPACE_LOGO, IDEVX_SPACE_WORDMARK_GRADIENT } from '@/constants/brand';
import { IDEVX_SPACE_PLATFORM_NAME } from '@/constants/app';

interface ProductLockupProps {
  /** Height of the mark in pixels; its width follows the image. */
  markHeight?: number;
  /** Type size of the name beside it. */
  fontSize?: number;
  /** Drops the name, leaving the mark alone — the collapsed sidebar rail. */
  isNameHidden?: boolean;
}

/**
 * The product's identity: its mark, then its name in the brand's gradient.
 *
 * **The name is the platform's alone.** The company that makes it is credited
 * in the attribution at the foot of every screen, and naming it here too would
 * make the product sound like a sub-brand of it.
 *
 * One component for every place the lockup appears — the desktop sidebar's
 * header and the mobile branding bar — because a lockup is the one thing in an
 * interface that may not vary between screens. Two copies drift in a way nobody
 * reports as a bug: a gradient that runs the other way, a mark two pixels
 * smaller, a gap that differs. Only the sizes are the caller's.
 *
 * Its colours come from `constants/brand.ts` and none from the palette: a
 * deployment may restyle the theme, and the mark must not follow it.
 *
 * @example <ProductLockup markHeight={24} fontSize={16} />
 */
export const ProductLockup = ({
  markHeight = 32,
  fontSize = 20,
  isNameHidden = false,
}: ProductLockupProps) => (
  <Stack direction="row" alignItems="center" spacing={1.25} justifyContent="center">
    <Box
      component="img"
      src={IDEVX_SPACE_LOGO}
      alt={IDEVX_SPACE_PLATFORM_NAME}
      sx={{ height: markHeight, width: 'auto', flexShrink: 0 }}
    />
    {!isNameHidden && (
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize,
          lineHeight: 1,
          // The gradient is painted through the glyphs, not behind them, and
          // that needs the whole set: both the prefixed and unprefixed
          // `background-clip`, a transparent fill, *and* a block box. Drop the
          // unprefixed pair and it paints as a filled rectangle behind the
          // word; leave the box inline and it sizes to the line, not the
          // letters.
          backgroundImage: IDEVX_SPACE_WORDMARK_GRADIENT,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          display: 'inline-block',
        }}
      >
        {IDEVX_SPACE_PLATFORM_NAME}
      </Typography>
    )}
  </Stack>
);
