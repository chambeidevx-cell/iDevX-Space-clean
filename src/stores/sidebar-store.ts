import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  isCollapsed: boolean;
  isHovered: boolean;
  toggleSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isHovered: false,
      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setIsHovered: (isHovered) => set({ isHovered }),
    }),
    {
      name: 'sidebar',
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    },
  ),
);
