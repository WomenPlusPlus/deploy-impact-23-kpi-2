import { PaletteMode, ThemeOptions } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#FBBB21',
          },
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
        root: {
          display: 'flex',
          textTransform: 'unset',
          width: 'fit-content',
          color: '#000',
          gap: '8px',
          borderRadius: 0,
          height: 'fit-content',
        },
        sizeMedium: {
          padding: '10px 14px',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '24px',
        },
        sizeSmall: {
          padding: '8px 12px',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '20px',
        },
        outlined: {
          alignItems: 'center',
          border: '1px solid var(--black-white-black, #000)',
        },
        outlinedSizeMedium: {
          padding: '12px',
        },
        contained: {
          background: 'var(--sunglow-300, #FECC33)',
          boxShadow: 'unset',
        },
        textError: {
          color: '#D63503',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#000',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          columnGap: '48px',
        },
        indicator: {
          backgroundColor: 'var(--sunglow-600, #FBBB21)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'var(--black-white-black, #000)',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '28px',
          padding: 0,
          textTransform: 'unset',
          '&.Mui-selected': {
            color: 'var(--black-white-black, #000)',
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          color: 'var(--gray-600, #ABA8A3)',
        },
        ol: {
          columnGap: '24px',
        },
        separator: {
          marginLeft: '14px',
          marginRight: '14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 500,
          color: '#000',
          transform: 'translate(0, -1.5px) scale(1)',
        },
        asterisk: {
          color: '#D63503',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 400,
        },
        input: {
          padding: '8px 12px',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 500,
          color: '#000',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '14px',
          fontWeight: 400,
          color: '#000',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          padding: '36px 24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '16px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#fff',
          color: '#000',
          border: '1px solid var(--sunglow-600, #FBBB21)',
          borderRadius: 0,
          padding: '6px 8px',
          fontSize: '10px',
          fontWeight: 400,
          lineHeight: '16px',
          maxWidth: 'none',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 500,
          padding: '10px 14px',
        },
      },
    },
    // ...(mode === 'light' ? {} : {}),
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
});

export const globalStyles = {
  pageTitle: {
    fontSize: '32px',
    fontWeight: 500,
    color: '#000',
  },
  pageHistory: {
    fontSize: '32px',
    fontWeight: 500,
    color: 'inherit',
  },
  drawerInputLabel: {
    fontSize: '14px',
    fontWeight: 400,
    width: '64px',
  },
  drawerLabelContent: {
    fontSize: '14px',
    fontWeight: 400,
  },
  buttonTinySize: {
    padding: '6px 8px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
  },
};