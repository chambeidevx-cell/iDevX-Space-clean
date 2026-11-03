import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FiltersVisibilityStore {
  /** Whether the filter panel is docked open on desktop. */
  isVisible: boolean;
  toggle: () => void;
}

/**
 * Whether the filter panel is shown, remembered across reloads.
 *
 * Deliberately one preference for the whole app rather than one per page:
 * someone who works with filters open expects them open wherever they go, and
 * a per-page memory would have them appear and vanish while navigating.
 */
export const useFiltersVisibilityStore = create<FiltersVisibilityStore>()(
  persist(
    (set) => ({
      isVisible: true,
      toggle: () => set((state) => ({ isVisible: !state.isVisible })),
    }),
    { name: 'filters-visibility-store' },
  ),
);
