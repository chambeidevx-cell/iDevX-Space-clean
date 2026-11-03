/** Parts a name format may be built from. */
export const NAME_TOKENS = [
  { value: 'last_name', label: 'Last Name' },
  { value: 'first_name', label: 'First Name' },
  { value: 'middle_name', label: 'Middle Name' },
  { value: 'middle_initial', label: 'Middle Initial' },
  { value: 'suffix', label: 'Suffix' },
] as const;

export const VALID_NAME_TOKENS = new Set(NAME_TOKENS.map(({ value }) => `{${value}}`));

/**
 * Format used until an administrator changes it in Account Settings.
 *
 * Literals between tokens — the comma, the space, the period after an initial —
 * are part of the format and are dropped along with any token that resolves to
 * nothing, so a person without a middle name never renders as "Doe, John .".
 */
export const DEFAULT_NAME_FORMAT = '{last_name}, {first_name} {middle_initial}. {suffix}';
