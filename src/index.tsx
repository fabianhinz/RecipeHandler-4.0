import * as serviceWorker from "./serviceWorker";
import App from "./Components/App";
import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider } from "./Components/Routes/RouterContext";
import { SnackbarProvider } from "notistack";
import "typeface-roboto";
import "animate.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
    <>
        <BrowserRouter>
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
        </BrowserRouter>
    </>,
    document.getElementById("root")
);

serviceWorker.register();
