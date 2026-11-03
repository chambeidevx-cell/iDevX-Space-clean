import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
  const storedTheme = localStorage.getItem('theme-mode') as ThemeMode | null;
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: getInitialTheme(),
  toggleTheme: () => set((state) => {
    const newMode = state.mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme-mode', newMode);
    return { mode: newMode };
  }),
  setTheme: (mode: ThemeMode) => {
    localStorage.setItem('theme-mode', mode);
    set({ mode });
  },
}));
