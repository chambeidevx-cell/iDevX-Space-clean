import { useMemo } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { createAppTheme } from '@/utils/theme';

export const useTheme = () => {
  const { mode, toggleTheme, setTheme } = useThemeStore();
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  return {
    theme,
    mode,
    toggleTheme,
    setTheme,
  };
};
