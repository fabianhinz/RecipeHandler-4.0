import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#A5D6A7" },
    secondary: { main: "#FFCC80" }
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
