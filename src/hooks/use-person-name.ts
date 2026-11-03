import { useCallback } from 'react';
import { useNameFormatStore } from '@/stores/name-format-store';
import { PersonName, formatPersonName } from '@/utils/format-name';

/**
 * Formats a person's name using the format configured in Account Settings.
 *
 * Every name shown in the app goes through this, so changing the setting
 * updates grids, cards, modals and headers together rather than leaving each
 * screen with its own arrangement of the same parts.
 *
 * @example const getName = usePersonName(); getName(user); // 'Doe, John M.'
 */
export const usePersonName = (): ((person: PersonName) => string) => {
  const format = useNameFormatStore((state) => state.format);
  return useCallback((person: PersonName) => formatPersonName(person, format), [format]);
};
