/**
 * Decimal places for a plain decimal figure. Money does not use this — each
 * currency carries its own minor-unit precision, resolved by `Intl`.
 */
const DEFAULT_DECIMAL_PLACES = 2;

/** Currency used when a record does not carry its own. */
export const DEFAULT_CURRENCY = 'USD';

/**
 * Locale-aware grouping separators. `undefined` means the viewer's own locale,
 * so thousands separators match what they expect to read.
 */
const LOCALE = undefined;

/**
 * Decimal figure with grouping separators and a fixed number of decimals.
 *
 * @example formatNumber(1234.5) // '1,234.50'
 */
export const formatNumber = (value: number, decimals: number = DEFAULT_DECIMAL_PLACES): string =>
  new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/**
 * Whole-number tally, grouped but without decimals — "1,284 employees" rather
 * than "1,284.00".
 *
 * @example formatCount(1284) // '1,284'
 */
export const formatCount = (value: number): string => formatNumber(value, 0);

/**
 * Decimal places the currency actually uses, from its ISO 4217 minor unit —
 * 2 for USD and EUR, 0 for JPY and KRW, 3 for KWD and BHD.
 *
 * Always resolve precision through this rather than assuming 2, in display and
 * in input validation alike: a yen amount with cents is not a real amount.
 *
 * @example getCurrencyDecimals('JPY') // 0
 */
export const getCurrencyDecimals = (currency: string = DEFAULT_CURRENCY): number =>
  new Intl.NumberFormat(LOCALE, { style: 'currency', currency })
    .resolvedOptions().maximumFractionDigits ?? 2;

export interface CurrencyParts {
  /** Currency symbol, rendered at the cell's leading edge. */
  symbol: string;
  /** The figure itself, rendered at the trailing edge. */
  amount: string;
}

/**
 * Currency symbol and amount as separate strings, so a table can put the symbol
 * at the leading edge of the cell and the figure at the trailing edge — the
 * ledger layout, where decimal points line up down the column.
 *
 * Precision comes from the currency's ISO 4217 minor units rather than a fixed
 * 2: JPY has none, KWD has three. Never hard-code decimal places for money.
 *
 * Negatives use the accounting convention of parentheses — `(1,234.56)` — which
 * reads unambiguously in a column of figures where a leading minus is easy to
 * miss.
 *
 * @example getCurrencyParts(1234.5) // { symbol: '$', amount: '1,234.50' }
 */
export const getCurrencyParts = (
  value: number,
  currency: string = DEFAULT_CURRENCY,
): CurrencyParts => {
  const parts = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    currencySign: 'accounting',
  }).formatToParts(value);
  const symbol = parts
    .filter((part) => part.type === 'currency')
    .map((part) => part.value)
    .join('');
  const amount = parts
    .filter((part) => part.type !== 'currency')
    .map((part) => part.value)
    .join('')
    .trim();
  return { symbol, amount };
};

/**
 * Currency as one string, for places with no column to align within — summary
 * tiles, snackbars, sentences. Tables use `CurrencyCell` instead.
 *
 * @example formatCurrency(1234.5) // '$1,234.50'
 */
export const formatCurrency = (value: number, currency: string = DEFAULT_CURRENCY): string =>
  new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    currencySign: 'accounting',
  }).format(value);
