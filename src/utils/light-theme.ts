import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#FF7A18',
      light: '#FF9A3C',
      dark: '#E86100',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#175EA1',
      light: '#3A7FBA',
      dark: '#104578',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#FFD08A',
      light: '#FFE2B8',
      dark: '#E6B86A',
      contrastText: '#1A1A1A',

    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#92400E',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#2B6CB0',
      light: '#4A90D6',
      dark: '#1E4E86',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#14532D',
      contrastText: '#FFFFFF',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.36px', // -0.01em
    },
    h2: {
      fontSize: '30px',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.15px', // -0.005em
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '0px',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    h6: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },

    subtitle1: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    subtitle2: {
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'radial-gradient(ellipse at 20% 25%, rgba(77,179,255,0.20) 0%, transparent 50%), radial-gradient(ellipse at 78% 65%, rgba(255,122,24,0.18) 0%, transparent 45%), radial-gradient(ellipse at 55% 85%, rgba(139,92,246,0.18) 0%, transparent 40%), linear-gradient(160deg, #EEF6FF 0%, #F5F8FF 45%, #FEFEFE 80%, #FFF7F2 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          maxWidth: '256px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255,255,255,0.62)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 24px rgba(180,80,0,0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(255,255,255,0.65)',
          backdropFilter: 'blur(24px)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '14px',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.62)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 24px rgba(180,80,0,0.12)',
          overflow: 'hidden',
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(23,94,161,0.08)',
            borderBottom: '1px solid rgba(23,94,161,0.2)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.7rem',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            background: 'transparent',
          },
          '& .MuiDataGrid-row.row-odd': {
            background: 'transparent',
          },
          '& .MuiDataGrid-row.row-even': {
            background: 'rgba(23,94,161,0.04)',
          },
          '& .MuiDataGrid-row:hover': {
            background: 'rgba(23,94,161,0.08)',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            background: 'rgba(23,94,161,0.12)',
            '&:hover': {
              background: 'rgba(23,94,161,0.16)',
            },
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(23,94,161,0.1)',
          },
          // Resting state of a resize grip: visible enough to be found, quiet
          // enough not to compete with the header labels. It darkens under the
          // pointer and while a column is being dragged.
          '& .MuiDataGrid-columnSeparator': {
            color: 'rgba(23,94,161,0.4)',
          },
          '& .MuiDataGrid-columnSeparator--resizable:hover, & .MuiDataGrid-columnSeparator--resizing': {
            color: 'rgba(23,94,161,0.85)',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(23,94,161,0.1)',
            background: 'transparent',
          },
        },
      },
    },
  },
};
