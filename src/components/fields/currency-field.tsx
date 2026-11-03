import { InputAdornment, TextField, Typography } from '@mui/material';
import { DEFAULT_CURRENCY, getCurrencyDecimals, getCurrencyParts } from '@/utils/format-number';
import { MONO_TEXT_SX } from '@/constants/typography';

interface CurrencyFieldProps {
  label: string;
  /** Held as a string so a half-typed "12." survives editing. */
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Input for a monetary amount, following the same accounting rules as
 * `CurrencyCell`: the currency symbol leads, the figure is right-aligned, and
 * precision is capped at the currency's own minor unit.
 *
 * Deliberately `type="text"`, not `type="number"`. A number input accepts
 * exponent notation and unlimited decimals, silently permitting amounts the
 * currency cannot express, and its spinners are useless for money.
 *
 * The value is a string throughout. Converting to `number` on each keystroke
 * destroys a trailing decimal point mid-typing, and money should not round-trip
 * through a float any more often than it has to — convert once, at submit.
 *
 * @example <CurrencyField label="Monthly Amount" value={form.amount} onChange={setAmount} />
 */
export const CurrencyField = ({
  label,
  value,
  onChange,
  currency = DEFAULT_CURRENCY,
  required,
  disabled,
  error,
  helperText,
  fullWidth = true,
}: CurrencyFieldProps) => {
  const decimals = getCurrencyDecimals(currency);
  const { symbol } = getCurrencyParts(0, currency);

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
    const [whole, fraction] = cleaned.split('.');
    if (fraction === undefined) return onChange(whole);
    if (decimals === 0) return onChange(whole);
    onChange(`${whole}.${fraction.slice(0, decimals)}`);
  };

  /** Settle a half-typed amount into the currency's full precision. */
  const handleBlur = () => {
    if (!value.trim()) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    onChange(parsed.toFixed(decimals));
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      onBlur={handleBlur}
      size="small"
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="caption" sx={MONO_TEXT_SX} color="text.secondary">{symbol}</Typography>
            </InputAdornment>
          ),
        },
        htmlInput: {
          inputMode: 'decimal',
          style: { textAlign: 'right', ...MONO_TEXT_SX },
        },
      }}
    />
  );
};
