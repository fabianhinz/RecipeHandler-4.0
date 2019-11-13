import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { BrowserRouter } from 'react-router-dom'

import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import { ErrorBoundary } from './ErrorBoundary'
import { Header } from './Layout/Header/Header'
import { Main } from './Layout/Main'
import { BreakpointsProvider } from './Provider/BreakpointsProvider'
import { CategoriesCollectionProvider } from './Provider/CategoriesCollectionProvider'
import { FirebaseAuthProvider } from './Provider/FirebaseAuthProvider'
import { PinnedRecipesProvider } from './Provider/PinnedRecipesProvider'
import { RouterProvider } from './Provider/RouterProvider'
import { Container } from './Shared/Container'

// ? Wrapper component for all Provider under "./Provider"
const RecipesProvider: FC = ({ children }) => (
    <RouterProvider>
        <BreakpointsProvider>
            <FirebaseAuthProvider>
                <CategoriesCollectionProvider>
                    <PinnedRecipesProvider>{children}</PinnedRecipesProvider>
                </CategoriesCollectionProvider>
            </FirebaseAuthProvider>
        </BreakpointsProvider>
    </RouterProvider>
)

const THEME_COOKIE = { deps: ['theme-pref'], name: 'theme-pref' }

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)

    const [cookies, setCookie] = useCookies(THEME_COOKIE.deps)

    const handleThemeChange = () => {
        if (theme.palette.type === 'light') {
            setCookie(THEME_COOKIE.name, 'dark', { maxAge: 31536000 })
        } else {
            setCookie(THEME_COOKIE.name, 'light', { maxAge: 31536000 })
        }
    }

    useEffect(() => {
        const cookie: undefined | 'dark' | 'light' = cookies[THEME_COOKIE.name]
        if (!cookie) return

        const metaThemeColor = document.getElementsByName('theme-color')[0]

        if (cookie === 'dark') {
            setTheme(responsiveDarkTheme)
            metaThemeColor.setAttribute('content', '#424242')
        } else if (cookie === 'light') {
            setTheme(responsiveLightTheme)
            metaThemeColor.setAttribute('content', '#FFFFFF')
        }
    }, [cookies])

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
                            <Container>
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
