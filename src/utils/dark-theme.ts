import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF7A18',
      light: '#FF9A3C',
      dark: '#E86100',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4DB3FF',
      light: '#7CCAFF',
      dark: '#1E7CC8',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#FFD08A',
      light: '#FFE2B8',
      dark: '#E6B86A',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#0B0F14',
      paper: '#111827',

    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#D4893E',
      contrastText: '#111827',
    },
    info: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#15803D',
      contrastText: '#FFFFFF',
    },
    divider: '#1F2937',
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
          background: 'radial-gradient(ellipse at 20% 25%, rgba(77,179,255,0.45) 0%, transparent 50%), radial-gradient(ellipse at 78% 65%, rgba(255,122,24,0.3) 0%, transparent 45%), radial-gradient(ellipse at 55% 85%, rgba(139,92,246,0.2) 0%, transparent 40%), linear-gradient(160deg, #050A12 0%, #080F1E 45%, #0C1628 80%, #070C18 100%)',
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
          background: 'rgba(8,12,20,0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(8,12,20,0.65)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
        input: {
          // The browser draws the date/time picker icon in near-black, which
          // disappears against a dark field. Inverting it is the only way to
          // recolour a native shadow-DOM control.
          '&::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)',
            opacity: 0.7,
            cursor: 'pointer',
            '&:hover': {
              opacity: 1,
            },
          },
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
          background: 'rgba(8,12,20,0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(77,179,255,0.12)',
            borderBottom: '1px solid rgba(77,179,255,0.25)',
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
            background: 'rgba(255,255,255,0.03)',
          },
          '& .MuiDataGrid-row:hover': {
            background: 'rgba(77,179,255,0.08)',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            background: 'rgba(77,179,255,0.14)',
            '&:hover': {
              background: 'rgba(77,179,255,0.20)',
            },
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(255,255,255,0.06)',
          },
          // Resting state of a resize grip: visible enough to be found, quiet
          // enough not to compete with the header labels. It brightens under
          // the pointer and while a column is being dragged.
          '& .MuiDataGrid-columnSeparator': {
            color: 'rgba(77,179,255,0.45)',
          },
          '& .MuiDataGrid-columnSeparator--resizable:hover, & .MuiDataGrid-columnSeparator--resizing': {
            color: 'rgba(77,179,255,0.9)',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
          },
        },
      },
    },
  },
};
