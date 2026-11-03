import { Box, LinearProgress, Stack, Typography } from '@mui/material';

export interface BreakdownRow {
  label: string;
  value: number;
  color: string;
  /** Shown to the right of the value — a share, an amount, a delta. */
  caption?: string;
}

interface BreakdownListProps {
  rows: BreakdownRow[];
  /**
   * Denominator for the bars. Omit to scale against the largest row, which
   * compares rows to each other rather than to a whole.
   */
  total?: number;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
}

/**
 * A labelled list with a proportional bar per row — the shape most dashboard
 * breakdowns take.
 *
 * `total` decides what the bars mean. With one, a bar is a share of the whole
 * and the row can be read on its own; without, bars scale to the largest row
 * and only compare against each other. Mixing the two silently would make a
 * dominant row look full in one panel and partial in another.
 *
 * @example <BreakdownList rows={rows} total={clientCount} />
 */
export const BreakdownList = ({
  rows,
  total,
  formatValue = (value) => String(value),
  emptyMessage = 'Nothing to show yet.',
}: BreakdownListProps) => {
  if (rows.length === 0) {
    return (
      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', py: 2, textAlign: 'center' }}>
        {emptyMessage}
      </Typography>
    );
  }

  const denominator = total ?? Math.max(...rows.map((row) => row.value), 1);

  return (
    <Stack spacing={1.75}>
      {rows.map((row) => {
        const percent = denominator === 0 ? 0 : Math.round((row.value / denominator) * 100);
        return (
          <Box key={row.label}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2">{row.label}</Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatValue(row.value)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.caption ?? `${percent}%`}
                </Typography>
              </Stack>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: `${row.color}22`,
                '& .MuiLinearProgress-bar': { bgcolor: row.color, borderRadius: 3 },
              }}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
