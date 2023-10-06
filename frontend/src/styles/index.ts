import { PaletteMode, ThemeOptions } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
        }
      : {
          // palette values for dark mode
        }),
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          color: '#000',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: '#F0EEEB',
          height: '66px',
          padding: '0 !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          display: 'flex',
          padding: '12px',
          alignItems: 'center',
          border: '1px solid var(--black-white-black, #000)',
          color: 'var(--black-white-black, #000)',
          textTransform: 'unset',
          fontWeight: 400,
          fontSize: '16px',
        },
      },
    },
    // ...(mode === 'light' ? {} : {}),
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
});
