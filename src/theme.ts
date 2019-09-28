import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const BORDER_RADIUS = 10;

const sharedTheme: Partial<ThemeOptions> = {
    overrides: {
        MuiExpansionPanel: {
            rounded: {
                "&:first-child": {
                    borderTopLeftRadius: BORDER_RADIUS,
                    borderTopRightRadius: BORDER_RADIUS
                },
                "&:last-child": {
                    borderBottomLeftRadius: BORDER_RADIUS,
                    borderBottomRightRadius: BORDER_RADIUS
                }
            }
        },
        MuiPaper: {
            rounded: {
                borderRadius: BORDER_RADIUS
            }
        },
        MuiCard: {
            root: {
                borderRadius: BORDER_RADIUS
            }
        },
        MuiChip: {
            root: {
                cursor: "pointer"
            },
            sizeSmall: {
                cursor: "auto"
            }
        },
        MuiOutlinedInput: {
            notchedOutline: {
                borderRadius: BORDER_RADIUS
            }
        },
        MuiButton: {
            root: {
                borderRadius: BORDER_RADIUS
            }
        },
        MuiButtonBase: {
            root: {
                borderRadius: BORDER_RADIUS
            }
        },
        MuiCardHeader: {
            action: {
                alignSelf: "center"
            }
        },
        // ! workaround https://github.com/mui-org/material-ui/issues/16374
        MuiAvatar: {
            root: {
                width: 32,
                height: 32
            }
        }
    }
};

const PRIMARY_COLOR = "#A5D6A7";
const SECONDARY_COLOR = "#FFCC80";

const darkTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: { main: PRIMARY_COLOR },
        secondary: { main: SECONDARY_COLOR }
    },
    ...sharedTheme
});
export const responsiveDarkTheme = responsiveFontSizes(darkTheme);

const lightTheme = createMuiTheme({
    palette: {
        type: "light",
        primary: { main: PRIMARY_COLOR },
        secondary: { main: SECONDARY_COLOR }
    },
    ...sharedTheme
});
export const responsiveLightTheme = responsiveFontSizes(lightTheme);
