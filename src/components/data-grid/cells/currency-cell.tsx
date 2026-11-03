import { Box, Typography } from '@mui/material';
import { getCurrencyParts } from '@/utils/format-number';
import { MONO_TEXT_SX } from '@/constants/typography';

interface CurrencyCellProps {
  value: number;
  /** ISO 4217 code. Defaults to the app's currency. */
  currency?: string;
}

/**
 * Money in a grid cell, laid out the way a ledger is: currency symbol pinned to
 * the leading edge, the figure pinned to the trailing edge, decimal points
 * aligned down the column.
 *
 * Precision follows the currency rather than a fixed 2 decimals, and negatives
 * render in parentheses — see `getCurrencyParts`.
 *
 * Set the column to `align: 'right'` so its header sits over the figures.
 *
 * @example renderCell: (params) => <CurrencyCell value={params.value} />
 */
export const CurrencyCell = ({ value, currency }: CurrencyCellProps) => {
  const { symbol, amount } = getCurrencyParts(value, currency);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <Typography component="span" sx={{ ...MONO_TEXT_SX, fontSize: 'inherit', color: 'text.secondary' }}>
        {symbol}
      </Typography>
      <Typography component="span" sx={{ ...MONO_TEXT_SX, fontSize: 'inherit' }}>
        {amount}
      </Typography>
    </Box>
  );
};
