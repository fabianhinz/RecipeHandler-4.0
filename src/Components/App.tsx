import { Container } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { SnackbarProvider } from 'notistack'
import React, { FC, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import { ErrorBoundary } from './ErrorBoundary'
import { Header } from './Layout/Header/Header'
import { Main } from './Layout/Main'
import { BreakpointsProvider } from './Provider/BreakpointsProvider'
import { CategoriesCollectionProvider } from './Provider/CategoriesCollectionProvider'
import { DraggableRecipesProvider } from './Provider/DraggableRecipesProvider'
import { FirebaseAuthProvider } from './Provider/FirebaseAuthProvider'
import { RouterProvider } from './Provider/RouterProvider'

// ? Wrapper component for all Provider under "./Provider"
const RecipesProvider: FC = ({ children }) => (
    <RouterProvider>
        <BreakpointsProvider>
            <FirebaseAuthProvider>
                <CategoriesCollectionProvider>
                    <DraggableRecipesProvider>{children}</DraggableRecipesProvider>
                </CategoriesCollectionProvider>
            </FirebaseAuthProvider>
        </BreakpointsProvider>
    </RouterProvider>
)

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)

    const handleThemeChange = () => {
        const isPaletteLight = theme.palette.type === 'light'
        const metaThemeColor = document.getElementsByName('theme-color')[0]

        if (isPaletteLight) {
            setTheme(responsiveDarkTheme)
            metaThemeColor.setAttribute('content', '#424242')
        } else {
            setTheme(responsiveLightTheme)
            metaThemeColor.setAttribute('content', '#FFFFFF')
        }
    }

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SnackbarProvider
                        preventDuplicate
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                        <RecipesProvider>
                            <Container maxWidth="lg">
                                <Header onThemeChange={handleThemeChange} />
                                <Main />
                            </Container>
                        </RecipesProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
