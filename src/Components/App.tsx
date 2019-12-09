import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import ErrorBoundary from './ErrorBoundary'
import Footer from './Footer'
import Main from './Main'
import BreakpointsProvider from './Provider/BreakpointsProvider'
import CategoriesCollectionProvider from './Provider/CategoriesCollectionProvider'
import FirebaseAuthProvider, { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import PinnedRecipesProvider from './Provider/PinnedRecipesProvider'
import RouterProvider from './Provider/RouterProvider'
import SelectedAttachementProvider from './Provider/SelectedAttachementProvider'
import Container from './Shared/Container'

// ? Wrapper component for all Provider under "./Provider"
const RecipesProvider: FC = ({ children }) => (
    <RouterProvider>
        <BreakpointsProvider>
            <FirebaseAuthProvider>
                <CategoriesCollectionProvider>
                    <SelectedAttachementProvider>
                        <PinnedRecipesProvider>{children}</PinnedRecipesProvider>
                    </SelectedAttachementProvider>
                </CategoriesCollectionProvider>
            </FirebaseAuthProvider>
        </BreakpointsProvider>
    </RouterProvider>
)

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)

    // ToDo Provider
    const handleThemeChange = () => {
        const metaThemeColor = document.getElementsByName('theme-color')[0]

        if (theme.palette.type === 'light') {
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
                        autoHideDuration={3000}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}>
                        <RecipesProvider>
                            <Container>
                                <Main />
                                <Footer />
                            </Container>
                        </RecipesProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
