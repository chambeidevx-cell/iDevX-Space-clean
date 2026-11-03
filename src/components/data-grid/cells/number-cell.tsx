import { Box } from '@mui/material';
import { formatCount, formatNumber } from '@/utils/format-number';

/**
 * Fixed-width digits, so decimal points line up down the column. Without this,
 * proportional digits make a column of figures look ragged.
 */
const TABULAR_FIGURES = { fontVariantNumeric: 'tabular-nums' } as const;

interface NumberCellProps {
  value: number;
  /**
   * Whole-number tally — renders without decimals. Use for things that are
   * counted rather than measured, where "42.00 clients" would read as an error.
   */
  isCount?: boolean;
}

/**
 * Numeric grid cell: grouping separators, two decimals, right-aligned with
 * fixed-width digits so the column reads as a column.
 *
 * Money uses `CurrencyCell` instead — it has its own precision rules and
 * symbol placement.
 *
 * Set the column to `align: 'right'` so its header sits over the figures.
 *
 * @example renderCell: (params) => <NumberCell value={params.value} />
 */
export const NumberCell = ({ value, isCount = false }: NumberCellProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
      height: '100%',
      ...TABULAR_FIGURES,
    }}
  >
    {isCount ? formatCount(value) : formatNumber(value)}
  </Box>
);
