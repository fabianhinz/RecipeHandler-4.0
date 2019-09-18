import CssBaseline from "@material-ui/core/CssBaseline";
import React, { FC, useState } from "react";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { Container } from "@material-ui/core";
import { Footer } from "./Layout/Footer";
import { Header } from "./Layout/Header/Header";
import { Main } from "./Layout/Main";
import { responsiveDarkTheme, responsiveLightTheme } from "../theme";

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme);
    // ? on file select / drag & drop, the theme changes
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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header onThemeChange={handleThemeChange} />
                <Main />
                <Footer />
            </Container>
        </ThemeProvider>
    );
};

export default App;
