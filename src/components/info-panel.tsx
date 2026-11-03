import { ReactNode } from 'react';
import { Box, Stack, SxProps, Theme, Typography, alpha, useTheme } from '@mui/material';

/**
 * What the panel is reporting. Maps to the theme's own palette rather than to
 * fixed hex values, so a callout picks up a project's colours with the rest of
 * the interface.
 */
export type InfoPanelSeverity = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'neutral';

/** Width of the accent bar down the leading edge. */
const ACCENT_WIDTH = 4;

interface InfoPanelProps {
  severity?: InfoPanelSeverity;
  /** Shown in the accent colour, before the content. */
  icon?: ReactNode;
  /** Small heading above the content. */
  title?: string;
  children: ReactNode;
  /** Pinned to the trailing edge — the panel's own actions. */
  actions?: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * A block of information set apart from the page around it: tinted, with an
 * accent bar down its leading edge and an optional icon.
 *
 * For the fact a screen is really about — the state of a subscription, why
 * something is locked, what a destructive action will do — where plain text in
 * the flow of a page is read as one more paragraph and skipped. The tint carries
 * the severity, so the panel is placed before it is read.
 *
 * Colours come from the theme's palette, never from fixed hex values: a callout
 * is a surface like any other and has to survive both themes and a project's own
 * colours. The tint is deliberately faint — it marks the block without competing
 * with the content inside it.
 *
 * @example
 * <InfoPanel severity="warning" icon={<WarningIcon />} title="Expiring soon">
 *   Ends 14 February 2026.
 * </InfoPanel>
 */
export const InfoPanel = ({
  severity = 'info',
  icon,
  title,
  children,
  actions,
  sx,
}: InfoPanelProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = severity === 'neutral'
    ? theme.palette.text.secondary
    : theme.palette[severity].main;

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(accent, isDark ? 0.28 : 0.24),
          borderLeft: `${ACCENT_WIDTH}px solid ${accent}`,
          bgcolor: alpha(accent, isDark ? 0.1 : 0.06),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {icon && (
        <Box
          aria-hidden
          sx={{
            display: 'flex',
            color: accent,
            flexShrink: 0,
            // Nudged onto the first line of text rather than the box's top.
            mt: '2px',
            '& .MuiSvgIcon-root': { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {title && (
          <Typography
            sx={{
              mb: 0.75,
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: accent,
            }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Box>

      {actions && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
          {actions}
        </Stack>
      )}
    </Box>
  );
};
