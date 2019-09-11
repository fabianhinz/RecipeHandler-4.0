import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

const sharedTheme: Partial<ThemeOptions> = {
  overrides: {
    MuiExpansionPanel: {
      rounded: {
        "&:first-child": {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        },
        "&:last-child": {
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        }
      }
    },
    MuiButtonGroup: {
      contained: {
        boxShadow: "none"
      }
    },
    MuiPaper: {
      root: {
        borderRadius: 10
      }
    },
    MuiCard: {
      root: {
        borderRadius: 10
      }
    },
    MuiChip: {
      root: {
        cursor: "pointer"
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
