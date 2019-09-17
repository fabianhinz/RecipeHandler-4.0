import * as serviceWorker from "./serviceWorker";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router } from "react-router";
import { RouterProvider } from "./routes/RouterContext";
import { SnackbarProvider } from "notistack";
import "typeface-roboto";
import "animate.css";

ReactDOM.render(
    <>
        <Router history={createBrowserHistory()}>
            <SnackbarProvider
                preventDuplicate
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
            >
                <RouterProvider>
                    <App />
                </RouterProvider>
            </SnackbarProvider>
        </Router>
    </>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
