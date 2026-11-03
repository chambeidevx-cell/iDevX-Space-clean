import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_NAME_FORMAT } from '@/constants/name-format';

interface NameFormatStore {
  /** Token template applied to every person's name shown in the app. */
  format: string;
  /** Whether names are captured as separate parts rather than one field. */
  isSegregated: boolean;
  setFormat: (format: string) => void;
  setIsSegregated: (isSegregated: boolean) => void;
}

/**
 * How people's names are displayed, set once in Account Settings and applied
 * everywhere a name is rendered.
 *
 * Lives in a store rather than in the settings page so a grid cell, a card and
 * a modal cannot each fall back to their own arrangement of the same parts.
 */
export const useNameFormatStore = create<NameFormatStore>()(
  persist(
    (set) => ({
      format: DEFAULT_NAME_FORMAT,
      isSegregated: false,
      setFormat: (format) => set({ format }),
      setIsSegregated: (isSegregated) => set({ isSegregated }),
    }),
    { name: 'name-format-store' },
  ),
);
