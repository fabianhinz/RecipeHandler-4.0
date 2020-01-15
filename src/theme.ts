import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

export const BORDER_RADIUS = 10
export const BORDER_RADIUS_HUGE = 16

const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

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
        MuiCardActionArea: {
            root: {
                margin: isSafari ? 1 : undefined,
            },
        },
        MuiPaper: {
            rounded: {
                borderRadius: BORDER_RADIUS,
                // ! ToDo this is a hack :( what can we do instead?
                margin: isSafari ? 1 : undefined,
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
                justifyContent: 'space-evenly',
            },
        },
    },
}

export const PRIMARY_COLOR = '#81c784'
export const SECONDARY_COLOR = '#ffb74d'

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
