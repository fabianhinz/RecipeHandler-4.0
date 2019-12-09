import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useEffect, useState } from 'react'

import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import Footer from './Footer'
import Main from './Main'
import BreakpointsProvider from './Provider/BreakpointsProvider'
import CategoriesCollectionProvider from './Provider/CategoriesCollectionProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import PinnedRecipesProvider from './Provider/PinnedRecipesProvider'
import RouterProvider from './Provider/RouterProvider'
import SelectedAttachementProvider from './Provider/SelectedAttachementProvider'
import Container from './Shared/Container'

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)
    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        if (!user) return
        const { muiTheme } = user
        const metaThemeColor = document.getElementsByName('theme-color')[0]

        if (muiTheme === 'dark') {
            setTheme(responsiveDarkTheme)
            metaThemeColor.setAttribute('content', '#424242')
        } else {
            setTheme(responsiveLightTheme)
            metaThemeColor.setAttribute('content', '#FFFFFF')
        }
    }, [user])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                preventDuplicate
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <RouterProvider>
                    <BreakpointsProvider>
                        <CategoriesCollectionProvider>
                            <SelectedAttachementProvider>
                                <PinnedRecipesProvider>
                                    <Container>
                                        <Main />
                                        <Footer />
                                    </Container>
                                </PinnedRecipesProvider>
                            </SelectedAttachementProvider>
                        </CategoriesCollectionProvider>
                    </BreakpointsProvider>
                </RouterProvider>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App
