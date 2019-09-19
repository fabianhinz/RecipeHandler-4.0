import CssBaseline from "@material-ui/core/CssBaseline";
import React, { FC, useState } from "react";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { Container } from "@material-ui/core";
import { Header } from "./Layout/Header/Header";
import { Main } from "./Layout/Main";
import { responsiveDarkTheme, responsiveLightTheme } from "../theme";
import { SnackbarProvider } from "notistack";
import { RouterProvider } from "./Routes/RouterContext";
import { BrowserRouter } from "react-router-dom";

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme);

    const handleThemeChange = () => {
        const isPaletteLight = theme.palette.type === "light";
        const metaThemeColor = document.getElementsByName("theme-color")[0];

        if (isPaletteLight) {
            setTheme(responsiveDarkTheme);
            metaThemeColor.setAttribute("content", "#424242");
        } else {
            setTheme(responsiveLightTheme);
            metaThemeColor.setAttribute("content", "#FFFFFF");
        }
    };

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider
                    preventDuplicate
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                >
                    <RouterProvider>
                        <Container maxWidth="lg">
                            <Header onThemeChange={handleThemeChange} />
                            <Main />
                        </Container>
                    </RouterProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
