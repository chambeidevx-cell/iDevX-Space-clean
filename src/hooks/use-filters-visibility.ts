import { useCallback, useState } from 'react';
import { useFiltersVisibilityStore } from '@/stores/filters-visibility-store';
import { useIsMobile } from './use-is-mobile';

interface UseFiltersVisibilityResult {
  isFiltersVisible: boolean;
  toggleFilters: () => void;
}

/**
 * Filter-panel visibility for a list page.
 *
 * On desktop the panel is docked beside the list, so whether it is open is a
 * lasting preference — it persists across reloads and pages.
 *
 * On mobile the panel is a full-screen overlay, which is transient by nature:
 * it always starts closed, because restoring a remembered "open" would cover
 * the page with a filter sheet the moment it loads.
 *
 * @example const { isFiltersVisible, toggleFilters } = useFiltersVisibility();
 */
export const useFiltersVisibility = (): UseFiltersVisibilityResult => {
  const isMobile = useIsMobile();
  const isDockedVisible = useFiltersVisibilityStore((state) => state.isVisible);
  const toggleDocked = useFiltersVisibilityStore((state) => state.toggle);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleFilters = useCallback(() => {
    if (isMobile) {
      setIsOverlayOpen((isOpen) => !isOpen);
      return;
    }
    toggleDocked();
  }, [isMobile, toggleDocked]);

  return {
    isFiltersVisible: isMobile ? isOverlayOpen : isDockedVisible,
    toggleFilters,
  };
};
