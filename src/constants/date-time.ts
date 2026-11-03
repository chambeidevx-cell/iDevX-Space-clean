/**
 * Timezone every date and time is displayed in.
 *
 * Timestamps are stored in UTC and converted here for display, so a record
 * reads the same for everyone regardless of where their device is set. Without
 * this, two people looking at the same audit entry can see different dates —
 * and near midnight, different *days*.
 *
 * An IANA zone name, not a fixed offset, so daylight saving is handled by the
 * platform rather than by arithmetic. Change this one value to move the whole
 * app to another timezone.
 */
export const APP_TIME_ZONE = 'Asia/Manila';

/** Shown where the timezone needs to be stated, such as beside a timestamp. */
export const APP_TIME_ZONE_LABEL = 'PHT (UTC+8)';

/**
 * Locale used for month names and ordering. Fixed rather than taken from the
 * browser, so `10 Mar 2026` never renders as `3/10/2026` for some viewers.
 */
export const APP_DATE_LOCALE = 'en-GB';
