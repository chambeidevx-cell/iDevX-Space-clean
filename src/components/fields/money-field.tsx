import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { DEFAULT_CURRENCY, getCurrencyParts } from '@/utils/format-number';
import { MONO_TEXT_SX } from '@/constants/typography';

interface MoneyFieldProps {
  label: string;
  value: number;
  currency?: string;
  /** Trailing note such as "/ mo" or "per seat". */
  suffix?: ReactNode;
}

/**
 * Read-only monetary amount in a card or detail panel — the mobile counterpart
 * of `CurrencyCell`, formatted by the same accounting rules: currency symbol
 * leading, figure trailing, currency-defined precision, negatives in
 * parentheses.
 *
 * @example <MoneyField label="Monthly Amount" value={subscription.monthlyAmount} suffix="/ mo" />
 */
export const MoneyField = ({ label, value, currency = DEFAULT_CURRENCY, suffix }: MoneyFieldProps) => {
  const { symbol, amount } = getCurrencyParts(value, currency);
  return (
    <Stack>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={0.5}>
        <Typography variant="body2" sx={MONO_TEXT_SX} color="text.secondary">{symbol}</Typography>
        <Typography variant="body2" sx={{ ...MONO_TEXT_SX, fontWeight: 600 }}>
          {amount}
        </Typography>
        {suffix && (
          <Typography variant="caption" color="text.secondary">{suffix}</Typography>
        )}
      </Stack>
    </Stack>
  );
};
