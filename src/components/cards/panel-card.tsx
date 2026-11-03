import { ReactNode } from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

/**
 * Panels in a row share one height so their edges line up, and scroll their
 * own body rather than growing to fit the longest list.
 */
const DEFAULT_PANEL_HEIGHT = 420;

interface PanelCardProps {
  title: string;
  /** One line explaining what the panel shows. */
  subtitle?: string;
  /** Rendered under the header — a tab strip, a filter, a control. */
  action?: ReactNode;
  /** Set `'auto'` for a panel that should grow with its content instead. */
  height?: number | 'auto';
  children: ReactNode;
}

/**
 * The surface every dashboard panel sits on: a titled glass card whose body
 * scrolls inside a fixed height.
 *
 * Shares the glass recipe with `StatCard` — a translucent fill over a blur, a
 * hairline edge, an inset highlight — so a dashboard reads as one set of
 * surfaces floating over the background rather than a mix of card styles.
 *
 * The fixed height is the point of the pattern: panels sit side by side, and
 * letting each grow to its own content leaves a ragged row and pushes whatever
 * follows out of view. Long lists scroll within the panel instead.
 *
 * @example
 * <PanelCard title="Client Status" subtitle="Across all accounts">
 *   <Stack spacing={1}>{rows}</Stack>
 * </PanelCard>
 */
export const PanelCard = ({
  title,
  subtitle,
  action,
  height = DEFAULT_PANEL_HEIGHT,
  children,
}: PanelCardProps) => {
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
      sx={{
        background: glassBackground,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: glassBorder,
        boxShadow: glassShadow,
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          '&:last-child': { pb: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
        {/* `minHeight: 0` is what lets this shrink inside the flex column —
            without it the body refuses to go below its content height and the
            panel grows past its own height instead of scrolling. */}
        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

interface PanelRowProps {
  children: ReactNode;
  /** Colour of the hover glow. Defaults to the theme's secondary. */
  accentColor?: string;
  /** Marks a row as no longer current — dimmed and inert on hover. */
  isMuted?: boolean;
}

/**
 * A row inside a `PanelCard`, on its own faintly lifted surface.
 *
 * Giving each row an edge is what makes a list read as distinct entries at a
 * glance rather than as text separated by rules.
 *
 * @example <PanelRow accentColor="#22C55E">{content}</PanelRow>
 */
export const PanelRow = ({ children, accentColor, isMuted = false }: PanelRowProps) => (
  <Box
    sx={(theme) => {
      const isDark = theme.palette.mode === 'dark';
      const accent = accentColor ?? theme.palette.secondary.main;
      return {
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        transition: 'filter 0.25s ease, border-color 0.25s ease',
        ...(!isMuted && {
          '&:hover': {
            filter: `drop-shadow(0 0 8px ${accent}99)`,
            borderColor: accent,
          },
        }),
      };
    }}
  >
    {children}
  </Box>
);
