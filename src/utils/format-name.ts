import { DEFAULT_NAME_FORMAT } from '@/constants/name-format';

/** The parts a displayed name can be built from. */
export interface PersonName {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  suffix?: string;
}

const TOKEN_PATTERN = /(\{\w+\})/;

const getTokenValues = (person: PersonName): Record<string, string> => ({
  first_name: person.firstName?.trim() ?? '',
  last_name: person.lastName?.trim() ?? '',
  middle_name: person.middleName?.trim() ?? '',
  middle_initial: person.middleName?.trim().charAt(0) ?? '',
  suffix: person.suffix?.trim() ?? '',
});

/**
 * A person's name, arranged by the configured format.
 *
 * A token that resolves to nothing takes the literal that follows it with it,
 * so `{last_name}, {first_name} {middle_initial}. {suffix}` renders
 * "Doe, John M. Jr." with every part and plainly "Doe, John" without — rather
 * than "Doe, John . " with the orphaned punctuation of the missing parts.
 *
 * @example formatPersonName({ firstName: 'John', lastName: 'Doe' }) // 'Doe, John'
 */
export const formatPersonName = (
  person: PersonName,
  format: string = DEFAULT_NAME_FORMAT,
): string => {
  const values = getTokenValues(person);
  const parts = format.split(TOKEN_PATTERN).filter((part) => part !== '');
  let result = '';
  let skipNextLiteral = false;

  for (const part of parts) {
    if (TOKEN_PATTERN.test(part) && part.startsWith('{')) {
      const value = values[part.slice(1, -1)] ?? '';
      if (value) {
        result += value;
        skipNextLiteral = false;
      } else {
        skipNextLiteral = true;
      }
      continue;
    }
    // Literals only survive between two resolved tokens.
    if (skipNextLiteral) {
      skipNextLiteral = false;
      continue;
    }
    if (result === '') continue;
    result += part;
  }

  return result.replace(/\s+/g, ' ').replace(/[\s,]+$/, '').trim();
};
