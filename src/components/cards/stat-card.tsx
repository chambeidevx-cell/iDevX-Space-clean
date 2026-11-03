import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

export interface StatCardProps {
  label: string;
  value: number | string;
  unit: string;
  sublabel?: string;
  /** The icon component itself, not an element — the card sizes and tints it. */
  Icon: SvgIconComponent;
  /** Drives the top rail, the icon tile and the hover glow. */
  accentColor: string;
  /**
   * Makes the card a control — used where a figure also filters the view
   * beneath it. Added here rather than in a parallel card so an interactive
   * stat still looks like every other stat.
   */
  onClick?: () => void;
  /**
   * Marks the card as the active filter — shown as a tint over the glass, not
   * a border, so a row of cards keeps one edge weight.
   *
   * Only meaningful with `onClick`.
   */
  isSelected?: boolean;
}

/**
 * A single headline figure: what it measures, the number, and what qualifies it.
 *
 * Ported from the shared platform standard — keep it identical across projects
 * rather than restyling per app, so a dashboard reads the same everywhere.
 *
 * The accent colour appears three times (top rail, icon tile, hover glow) so a
 * row of cards is scannable by colour before any of it is read. The unit is a
 * separate, smaller element rather than part of the value, which keeps the
 * figures at a consistent weight down a row.
 *
 * @example
 * <StatCard
 *   label="Open Leads"
 *   value={7}
 *   unit="leads"
 *   sublabel="10 total"
 *   Icon={FilterAltOutlinedIcon}
 *   accentColor="#4DB3FF"
 * />
 */
const StatCard = ({ label, value, unit, sublabel, Icon, accentColor, onClick, isSelected = false }: StatCardProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const glassBackground = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.55)';
  const glassBorder = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.75)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
    : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)';

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        background: glassBackground,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: glassBorder,
        boxShadow: glassShadow,
        borderTop: `3px solid ${accentColor}`,
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        /* Selection tints the glass rather than ringing the card: a border
           thickens the edge and breaks the row's alignment, and the cards
           already carry their accent on the top rail. */
        ...(isSelected && {
          background: `linear-gradient(${accentColor}1F, ${accentColor}1F), ${glassBackground}`,
        }),
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 6px 8px ${accentColor}60`,
        },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              fontSize: '0.65rem',
              lineHeight: 1.4,
            }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${accentColor}18`,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: '0.95rem', color: accentColor }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {unit}
          </Typography>
        </Box>
        {sublabel && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.25, fontSize: '0.6rem' }}>
            {sublabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
