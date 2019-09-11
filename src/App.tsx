import React, { FC, useState } from "react";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "@material-ui/core";
import { Header } from "./layout/Header";
import { Main } from "./layout/Main";
import { Footer } from "./layout/Footer";
import { responsiveDarkTheme, responsiveLightTheme } from "./Theme";

const App: FC = () => {
  const [theme, setTheme] = useState(responsiveLightTheme);

  const handleThemeChange = () => {
    const isPaletteLight = theme.palette.type === "light";
    const metaThemeColor = document.getElementsByName("theme-color")[0];

    if (isPaletteLight) {
      setTheme(responsiveDarkTheme);
      metaThemeColor.setAttribute("content", "#303030");
    } else {
      setTheme(responsiveLightTheme);
      metaThemeColor.setAttribute("content", "#FAFAFA");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header
          themeType={theme.palette.type}
          onThemeToggle={handleThemeChange}
        />
        <Main />
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default App;
