import {
  adaptV4Theme,
  createTheme,
  DeprecatedThemeOptions,
  responsiveFontSizes,
} from '@mui/material'

export const BORDER_RADIUS = 10
export const BORDER_RADIUS_HUGE = 16

export const PRIMARY_COLOR = '#81c784'
export const SECONDARY_COLOR = '#ffb74d'

const sharedTheme: Partial<DeprecatedThemeOptions> = {
  props: {
    MuiPaper: {
      variant: 'outlined',
    },
    MuiTab: {
      disableRipple: true,
    },
    MuiTabs: {
      TabIndicatorProps: {
        children: <span />,
      },
    },
  },
  overrides: {
    // TODO fixme
    // MuiExpansionPanel: {
    //   rounded: {
    //     '&:first-child': {
    //       borderTopLeftRadius: BORDER_RADIUS,
    //       borderTopRightRadius: BORDER_RADIUS,
    //     },
    //     '&:last-child': {
    //       borderBottomLeftRadius: BORDER_RADIUS,
    //       borderBottomRightRadius: BORDER_RADIUS,
    //     },
    //   },
    // },
    MuiPaper: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
      outlined: {
        borderWidth: 2,
      },
    },
    MuiAvatar: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiCard: {
      root: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: 16,
        },
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiButton: {
      root: {
        borderRadius: BORDER_RADIUS,
        fontFamily: 'Ubuntu',
        textTransform: 'unset',
      },
    },
    MuiButtonBase: {
      root: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiCardHeader: {
      action: {
        alignSelf: 'center',
      },
    },
    MuiDialogTitle: {
      root: {
        paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
      },
    },
    MuiDialogActions: {
      root: {
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        justifyContent: 'space-evenly',
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: '0.825rem',
        fontWeight: 400,
      },
    },
    MuiTypography: {
      h5: {
        fontFamily: 'Ubuntu',
      },
      h6: {
        fontFamily: 'Ubuntu',
      },
    },
    MuiChip: {
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
    MuiTabs: {
      indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: 4,
        '& > span': {
          maxWidth: 40,
          width: '100%',
          borderRadius: BORDER_RADIUS,
          backgroundColor: SECONDARY_COLOR,
        },
      },
    },
    // TODO fix me
    // MuiTab: {
    //   wrapper: {
    //     fontFamily: 'Ubuntu',
    //     textTransform: 'capitalize',
    //   },
    // },
  },
}

const blackTheme = createTheme(
  adaptV4Theme({
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
)

export const responsiveBlackTheme = responsiveFontSizes(blackTheme)

const darkTheme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
      primary: { main: PRIMARY_COLOR },
      secondary: { main: SECONDARY_COLOR },
    },
    ...sharedTheme,
  })
)
export const responsiveDarkTheme = responsiveFontSizes(darkTheme)

const lightTheme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'light',
      primary: { main: PRIMARY_COLOR },
      secondary: { main: SECONDARY_COLOR },
    },
    ...sharedTheme,
  })
)
export const responsiveLightTheme = responsiveFontSizes(lightTheme)
