import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface MiniBarPoint {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: MiniBarPoint[];
  color: string;
  /** Plot area height in pixels, excluding the labels beneath. */
  height?: number;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
}

const DEFAULT_HEIGHT = 140;
/** Keeps a zero-value bar visible as a baseline rather than vanishing. */
const MIN_BAR_HEIGHT = 2;

/**
 * A compact bar chart for a short series — the last few months, the days of a
 * week.
 *
 * Deliberately built from layout rather than a charting library: a dozen bars
 * do not justify shipping one, and this inherits the app's colours and glass
 * surfaces instead of fighting a library's own theme.
 *
 * Bars scale to the largest value in the series, so the shape shows the trend;
 * the exact figure is in the tooltip.
 *
 * @example <MiniBarChart data={newLeadsByMonth} color="#38BDF8" />
 */
export const MiniBarChart = ({
  data,
  color,
  height = DEFAULT_HEIGHT,
  formatValue = (value) => String(value),
  emptyMessage = 'No data for this period.',
}: MiniBarChartProps) => {
  if (data.length === 0) {
    return (
      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', py: 4, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  const peak = Math.max(...data.map((point) => point.value), 1);

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      justifyContent="space-between"
      spacing={1}
      sx={{ height: height + 28 }}
    >
      {data.map((point) => (
        <Stack key={point.label} alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ height, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <Tooltip title={`${point.label}: ${formatValue(point.value)}`} placement="top" arrow>
              <Box
                sx={{
                  width: '100%',
                  height: Math.max((point.value / peak) * height, MIN_BAR_HEIGHT),
                  borderRadius: '6px 6px 2px 2px',
                  background: `linear-gradient(180deg, ${color}, ${alpha(color, 0.35)})`,
                  transition: 'filter 0.2s ease',
                  cursor: 'default',
                  '&:hover': { filter: `drop-shadow(0 0 8px ${alpha(color, 0.7)})` },
                }}
              />
            </Tooltip>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }} noWrap>
            {point.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
