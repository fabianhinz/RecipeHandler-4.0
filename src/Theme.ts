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
    MuiButtonGroup: {
      contained: {
        boxShadow: "none"
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
    MuiTabs: {
      flexContainer: {
        justifyContent: "space-evenly"
      },
      indicator: {
        // borderRadius: BORDER_RADIUS,
        // padding: 2
        background: "none"
      }
    },
    MuiTab: {
      textColorInherit: {
        opacity: 0.4,
        "& $selected": {
          opacity: 1
        }
      }
    },
    MuiCardContent: {
      root: {
        // width: "100%"
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
    // ! dirty workaround for https://github.com/mui-org/material-ui/issues/16374
    MuiAvatar: {
      root: {
        height: 32,
        width: 32
      },
      colorDefault: {
        color: "inherit",
        backgroundColor: "rgba(0, 0, 0, 0.1)"
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
