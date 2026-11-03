import { createTheme } from '@mui/material/styles';
import { lightThemeOptions } from './light-theme';
import { darkThemeOptions } from './dark-theme';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const themeOptions = mode === 'light' ? lightThemeOptions : darkThemeOptions;
  return createTheme(themeOptions);
};
