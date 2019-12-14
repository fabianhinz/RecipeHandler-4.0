import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

export const BORDER_RADIUS = 10
export const BORDER_RADIUS_HUGE = 16

const sharedTheme: Partial<ThemeOptions> = {
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
                margin:
                    /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)
                        ? 1
                        : undefined,
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
                    paddingBottom: 'inherhit',
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
            },
        },
    },
}

const PRIMARY_COLOR = '#A5D6A7'
const SECONDARY_COLOR = '#FFCC80'

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: { main: PRIMARY_COLOR },
        secondary: { main: SECONDARY_COLOR },
    },
    ...sharedTheme,
})
export const responsiveDarkTheme = responsiveFontSizes(darkTheme)

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: { main: PRIMARY_COLOR },
        secondary: { main: SECONDARY_COLOR },
    },
    ...sharedTheme,
})
export const responsiveLightTheme = responsiveFontSizes(lightTheme)
