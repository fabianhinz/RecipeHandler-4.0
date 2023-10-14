import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material'

const PRIMARY_COLOR = '#81c784'
const SECONDARY_COLOR = '#ffb74d'

const sharedTheme: Partial<ThemeOptions> = {
  shape: { borderRadius: 10 },
  typography: {
    h5: {
      fontFamily: 'Ubuntu',
    },
    h6: {
      fontFamily: 'Ubuntu',
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        // TODO wrapper key is no longer
        // wrapper: {
        //   fontFamily: 'Ubuntu',
        //   textTransform: 'capitalize',
        // },
      },
    },
    MuiTabs: {
      defaultProps: {
        TabIndicatorProps: {
          children: <span />,
        },
      },
      styleOverrides: {
        indicator: ({ theme }) => ({
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          height: 4,
          '& > span': {
            maxWidth: 40,
            width: '100%',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.secondary.main,
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Ubuntu',
          textTransform: 'unset',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:last-child': {
            paddingBottom: theme.spacing(2),
          },
        }),
      },
    },
    // TODO was ExpansionPanel
    MuiAccordion: {
      styleOverrides: {
        rounded: ({ theme }) => ({
          '&:first-child': {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          },
          '&:last-child': {
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        action: {
          alignSelf: 'center',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          justifyContent: 'space-evenly',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.825rem',
          fontWeight: 400,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          letterSpacing: '0.025rem',
          fontWeight: 500,
          fontFamily: 'Ubuntu',
        },
        labelSmall: {
          letterSpacing: '0.025rem',
          fontWeight: 500,
          fontFamily: 'Ubuntu',
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
  },
}

const blackTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: PRIMARY_COLOR },
    secondary: { main: SECONDARY_COLOR },
    background: {
      paper: '#1B1B1D',
      default: '#000',
    },
  },
  ...sharedTheme,
})

export const responsiveBlackTheme = responsiveFontSizes(blackTheme)

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: PRIMARY_COLOR },
    secondary: { main: SECONDARY_COLOR },
  },
  ...sharedTheme,
})
export const responsiveDarkTheme = responsiveFontSizes(darkTheme)

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: PRIMARY_COLOR },
    secondary: { main: SECONDARY_COLOR },
  },
  ...sharedTheme,
})
export const responsiveLightTheme = responsiveFontSizes(lightTheme)
