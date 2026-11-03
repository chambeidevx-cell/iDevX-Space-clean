import { APP_DATE_LOCALE, APP_TIME_ZONE } from '@/constants/date-time';

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

type DatePartName = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second';
type DateParts = Record<DatePartName, string>;

/**
 * The calendar fields of an instant **as seen in the app's timezone**.
 *
 * Built from `Intl` parts rather than `Date.getMonth()` and friends, which read
 * the browser's timezone and would show a different day to a viewer abroad.
 */
const getParts = (iso: string): DateParts => {
  const parts = new Intl.DateTimeFormat(APP_DATE_LOCALE, {
    timeZone: APP_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // h23 keeps midnight as 00 rather than 24.
    hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  return parts.reduce((accumulated, part) => (
    part.type === 'literal' ? accumulated : { ...accumulated, [part.type]: part.value }
  ), {} as DateParts);
};

/**
 * `DD MMM YYYY` in the app's timezone.
 *
 * @example formatDate('2026-03-10T00:15:00Z') // '10 Mar 2026'
 */
export const formatDate = (iso: string): string => {
  const { day, month, year } = getParts(iso);
  return `${day} ${month} ${year}`;
};

/**
 * `DD MMM YYYY HH:MM:SS` in the app's timezone. The standard timestamp for
 * history logs and audit views.
 *
 * @example formatDateTime('2026-03-10T00:15:00Z') // '10 Mar 2026 08:15:00'
 */
export const formatDateTime = (iso: string): string => {
  const { day, month, year, hour, minute, second } = getParts(iso);
  return `${day} ${month} ${year} ${hour}:${minute}:${second}`;
};

/**
 * `DD MMM YYYY HH:MM` in the app's timezone, for places where seconds are noise.
 *
 * @example formatDateTimeShort('2026-03-10T00:15:00Z') // '10 Mar 2026 08:15'
 */
export const formatDateTimeShort = (iso: string): string => {
  const { day, month, year, hour, minute } = getParts(iso);
  return `${day} ${month} ${year} ${hour}:${minute}`;
};

/**
 * `MMM DD, YYYY HH:MM:SS` in the app's timezone.
 *
 * @example formatHistoryDateLong('2026-03-10T00:15:00Z') // 'Mar 10, 2026 08:15:00'
 */
export const formatHistoryDateLong = (iso: string): string => {
  const { day, month, year, hour, minute, second } = getParts(iso);
  return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
};

/** The timestamp format used by history logs. See `formatDateTime`. */
export const formatHistoryDate = formatDateTime;

/**
 * `YYYY-MM-DD` in the app's timezone, the value an `<input type="date">` takes.
 *
 * Deriving this with `toISOString().slice(0, 10)` reads the date in UTC, which
 * lands on the previous day for any evening timestamp in a positive offset —
 * the date field then shows a day earlier than the rest of the screen.
 *
 * @example toDateInputValue('2026-03-10T20:00:00Z') // '2026-03-11'
 */
export const toDateInputValue = (iso: string): string => {
  const { day, month, year } = getParts(iso);
  const monthIndex = MONTHS.indexOf(month as (typeof MONTHS)[number]);
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day}`;
};

/**
 * Today in the app's timezone, as a `YYYY-MM-DD` value.
 *
 * The one way to ask "what is today" — the device's own date is a different
 * question, and near midnight a different answer.
 *
 * @example getTodayDateInput() // '2026-03-10'
 */
export const getTodayDateInput = (): string => toDateInputValue(new Date().toISOString());

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getDaysInMonth = (year: number, monthIndex: number): number =>
  monthIndex === 1 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[monthIndex];

/** Splits a `YYYY-MM-DD` value into numeric parts, with the month 0-based. */
const toDateParts = (date: string): { year: number; monthIndex: number; day: number } => {
  const [year, month, day] = date.split('-').map(Number);
  return { year, monthIndex: month - 1, day };
};

/**
 * Adds whole months to a `YYYY-MM-DD` date-input value.
 *
 * The arithmetic runs on the string's own parts rather than through a `Date`.
 * A date-only value carries no timezone, so putting it through a `Date` and
 * reading it back is precisely how an end date lands a day out — the rule in
 * `toDateInputValue`, applied in the other direction.
 *
 * The day of month is clamped to the target month, so a term counted from the
 * 31st ends on the last day of a shorter month rather than spilling into the
 * next one.
 *
 * @example addMonthsToDateInput('2026-01-31', 1) // '2026-02-28'
 * @example addMonthsToDateInput('2026-03-10', 36) // '2029-03-10'
 */
export const addMonthsToDateInput = (date: string, months: number): string => {
  const { year, monthIndex, day } = toDateParts(date);
  const total = year * 12 + monthIndex + months;
  const targetYear = Math.floor(total / 12);
  const targetMonth = total - targetYear * 12;
  const targetDay = Math.min(day, getDaysInMonth(targetYear, targetMonth));
  return [
    String(targetYear).padStart(4, '0'),
    String(targetMonth + 1).padStart(2, '0'),
    String(targetDay).padStart(2, '0'),
  ].join('-');
};

/**
 * Whole months from one `YYYY-MM-DD` value to another — the inverse of
 * `addMonthsToDateInput`, so a term set by adding months reads back as the same
 * number. A partial month at the end does not count.
 *
 * @example monthsBetweenDateInputs('2026-01-15', '2029-01-15') // 36
 * @example monthsBetweenDateInputs('2026-01-15', '2026-02-14') // 0
 */
export const monthsBetweenDateInputs = (from: string, to: string): number => {
  const start = toDateParts(from);
  const end = toDateParts(to);
  const months = (end.year - start.year) * 12 + (end.monthIndex - start.monthIndex);
  return end.day < start.day ? months - 1 : months;
};
