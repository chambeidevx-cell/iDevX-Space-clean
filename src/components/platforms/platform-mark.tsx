import { Box } from '@mui/material';
import { getPlatformBadge } from '@/constants/platform-badges';
import { PLATFORMS } from '@/constants/platforms';

/** Share of the disc taken by the glyph inside it. */
const GLYPH_RATIO = 0.55;

interface PlatformMarkProps {
  platform: string;
  /** Height of the mark, and the diameter of the disc where one is drawn. */
  size: number;
  /**
   * `disc` gives the mark a filled circle in the platform's colour — the form
   * used in lists and headers. `plain` draws the glyph on its own, for rows
   * that already carry the platform's name beside it.
   */
  variant?: 'disc' | 'plain';
  /** Dims the mark where the platform is not in use — an unsubscribed client. */
  isMuted?: boolean;
}

/**
 * A platform's mark: its own logo where it has one, otherwise its icon in the
 * platform's colour.
 *
 * A logo is drawn on its own even in the `disc` variant. The disc exists to
 * give a flat monochrome glyph a shape and a colour; a full-colour mark already
 * has both, and laying it over a tinted circle reads as two badges arguing with
 * each other.
 *
 * @example <PlatformMark platform="iDevX Space" size={32} />
 * @example <PlatformMark platform={id} size={18} variant="plain" isMuted={!isSubscribed} />
 */
export const PlatformMark = ({ platform, size, variant = 'disc', isMuted = false }: PlatformMarkProps) => {
  const logo = PLATFORMS.find((entry) => entry.id === platform)?.logo;
  const badge = getPlatformBadge(platform, variant === 'disc' ? size * GLYPH_RATIO : size);
  /* An image cannot be tinted the way an icon can, so it is drained of colour
     instead — the same "not in use" reading by other means. */
  const mutedSx = isMuted ? { opacity: 0.45, filter: 'grayscale(1)' } : undefined;

  if (logo) {
    return (
      <Box
        component="img"
        src={logo}
        alt=""
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          flexShrink: 0,
          transition: 'opacity 0.15s ease, filter 0.15s ease',
          ...mutedSx,
        }}
      />
    );
  }

  if (variant === 'plain') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: isMuted ? 'text.disabled' : badge.color,
          transition: 'color 0.15s ease',
        }}
      >
        {badge.icon}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: badge.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: size * GLYPH_RATIO,
        flexShrink: 0,
        ...mutedSx,
      }}
    >
      {badge.icon}
    </Box>
  );
};
