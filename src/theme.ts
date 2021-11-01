import { createTheme, responsiveFontSizes } from '@material-ui/core'
import { ThemeOptions } from '@material-ui/core/styles/createTheme'

export const BORDER_RADIUS = 10
export const BORDER_RADIUS_HUGE = 16

const sharedTheme: Partial<ThemeOptions> = {
    props: {
        MuiPaper: {
            variant: 'outlined',
        },
    },
    overrides: {
        MuiExpansionPanel: {
            rounded: {
                '&:first-child': {
                    borderTopLeftRadius: BORDER_RADIUS,
                    borderTopRightRadius: BORDER_RADIUS,
                },
                '&:last-child': {
                    borderBottomLeftRadius: BORDER_RADIUS,
                    borderBottomRightRadius: BORDER_RADIUS,
                },
            },
        },
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
    },
}

export const PRIMARY_COLOR = '#81c784'
export const SECONDARY_COLOR = '#ffb74d'

const blackTheme = createTheme({
    palette: {
        type: 'dark',
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
        type: 'dark',
        primary: { main: PRIMARY_COLOR },
        secondary: { main: SECONDARY_COLOR },
    },
    ...sharedTheme,
})
export const responsiveDarkTheme = responsiveFontSizes(darkTheme)

const lightTheme = createTheme({
    palette: {
        type: 'light',
        primary: { main: PRIMARY_COLOR },
        secondary: { main: SECONDARY_COLOR },
    },
    ...sharedTheme,
})
export const responsiveLightTheme = responsiveFontSizes(lightTheme)
