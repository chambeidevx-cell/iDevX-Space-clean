import { Avatar, Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { lighten } from '@mui/material/styles';

/** How far the mark and name are dimmed on a tile that is not in play. */
const MUTED_CONTENT_OPACITY = 0.55;

/** How far the chosen tile's colour is lifted above the platform's own. */
const SELECTED_LIGHTEN = 0.3;

/**
 * The tile's colour is the caller's, so it can arrive in a format `lighten`
 * cannot parse. A colour that will not brighten is better than a tile that
 * throws.
 */
const brighten = (value: string, amount: number): string => {
  try {
    return lighten(value, amount);
  } catch {
    return value;
  }
};

export interface PlatformCardProps {
  color: string;
  label: string;
  logo?: string;
  size?: number;
  onClick?: () => void;
  /**
   * Marks the card as the one being viewed. It simply holds the hovered look —
   * lifted, in full colour — so the choice stays visible once the pointer moves
   * on, and picking a tile is the same gesture as pointing at it.
   */
  isSelected?: boolean;
  /**
   * Makes the tile part of a picker: unselected tiles are held back so the
   * chosen one stands out.
   *
   * Off by default, because muting only means something where one tile is in
   * play. A row that simply lists what exists — the platforms someone can reach
   * from the home page — has no selection to contrast against, and dimming it
   * would just make the whole row look disabled.
   */
  isPicker?: boolean;
}

/**
 * A platform as a tile: its mark, its name, and a colour it is identified by.
 *
 * The colour is the caller's to decide. On a page listing what exists it is the
 * platform's own identity colour; where the tile reports a state — subscribed,
 * expiring, not subscribed — that state owns the colour instead, and the tiles
 * become a status row that reads before any of it is.
 *
 * @example <PlatformCard color={platform.color} label={platform.label} logo={platform.logo} />
 */
const PlatformCard = ({
  color,
  label,
  logo,
  size = 100,
  onClick,
  isSelected = false,
  isPicker = false,
}: PlatformCardProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  /** Only a tile competing with a chosen one is held back. */
  const isMuted = isPicker && !isSelected;

  const glassBackground = isDark
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(255, 255, 255, 0.55)';
  const glassBorder = isDark
    ? '1px solid rgba(255, 255, 255, 0.08)'
    : '1px solid rgba(255, 255, 255, 0.75)';
  /*
   * Three strengths, and only in a picker: the chosen tile brightened above its
   * own colour, the rest held well back, and a plain listing left at its normal
   * strength. A row of tiles all shouting their colour says nothing about which
   * is being configured — but a row with nothing to configure has no reason to
   * be dimmed at all. The hex suffixes are alpha: 14 ≈ 8%, 18 ≈ 9%, 30 ≈ 19%,
   * 44 ≈ 27%, 55 ≈ 33%, 80 ≈ 50%.
   *
   * Muting is done with alpha and opacity rather than a CSS `filter`: a filter
   * on this tile's wrapper would cancel the glass card's `backdrop-filter`
   * inside it, and the tile would lose its blur along with its colour.
   */
  const fullGradient = `linear-gradient(160deg, ${color}44 0%, ${color} 100%)`;
  const fadedGradient = `linear-gradient(160deg, ${color}14 0%, ${color}55 100%)`;
  const liftedShadow = 'translate(10px, -10px) rotate(20deg)';
  const restingShadow = 'translate(8px, -8px) rotate(16deg)';
  const liftedCard = 'perspective(400px) rotateX(14deg) rotateY(14deg)';
  /* The chosen tile is brighter than its own identity colour, not merely more
     opaque than the others: against four muted neighbours, more alpha alone
     still reads as the same colour turned up. */
  const selectedGradient = `linear-gradient(160deg, ${brighten(color, SELECTED_LIGHTEN)} 0%, ${color} 100%)`;
  const liftedGlow = `-6px 6px 28px ${color}80`;
  const restingGlow = `0 4px 20px ${color}18`;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        width: size,
        height: size,
        /* Hover previews what picking does, so it borrows the chosen look. */
        '&:hover .platform-shadow': {
          transform: liftedShadow,
          background: selectedGradient,
        },
        '&:hover .platform-content': { opacity: 1 },
      }}
    >
      <Box
        className="platform-shadow"
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 3,
          background: isSelected ? selectedGradient : (isMuted ? fadedGradient : fullGradient),
          transform: isSelected ? liftedShadow : restingShadow,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease',
        }}
      />
      <Card
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          background: glassBackground,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: glassBorder,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSelected ? liftedGlow : (isMuted ? restingGlow : `0 4px 20px ${color}30`),
          transform: isSelected ? liftedCard : 'none',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
          transformStyle: 'preserve-3d',
          '&:hover': {
            transform: liftedCard,
            boxShadow: liftedGlow,
          },
        }}
      >
        <CardContent
          className="platform-content"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.75,
            p: 1.5,
            opacity: isMuted ? MUTED_CONTENT_OPACITY : 1,
            transition: 'opacity 0.3s ease',
            '&:last-child': { pb: 1.5 },
          }}
        >
          {logo
            ? (
              <Box
                component="img"
                src={logo}
                alt={label}
                sx={{ width: size * 0.28, height: size * 0.28, objectFit: 'contain' }}
              />
            )
            : (
              <Avatar
                variant="rounded"
                sx={{
                  width: size * 0.36,
                  height: size * 0.36,
                  bgcolor: color,
                  fontSize: `${size * 0.01}rem`,
                  fontWeight: 700,
                  color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.75)',
                  borderRadius: '100%',
                }}
              >
                {label.charAt(0)}
              </Avatar>
            )
          }
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.75)',
              textAlign: 'center',
              lineHeight: 1.2,
              fontSize: '0.65rem',
            }}
          >
            {label}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlatformCard;
