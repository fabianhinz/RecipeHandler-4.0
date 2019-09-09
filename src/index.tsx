import * as serviceWorker from "./serviceWorker";
import App from "./components/App";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactDOM from "react-dom";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { createBrowserHistory } from "history";
import { createMuiTheme } from "@material-ui/core";
import { Router } from "react-router";
import { SnackbarProvider } from "notistack";
import "typeface-roboto";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#A5D6A7" },
    secondary: { main: "#FFCC80" }
  },
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
    }
  }
});

ReactDOM.render(
  <>
    <CssBaseline />
    <Router history={createBrowserHistory()}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
