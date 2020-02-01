import { useMediaQuery } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import { isSafari } from '../util/constants'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import AnimationProvider from './Provider/AnimationProvider'
import { useBreakpointsContext } from './Provider/BreakpointsProvider'
import CategoriesCollectionProvider from './Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from './Provider/DeviceOrientationProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import GridProvider from './Provider/GridProvider'
import PinnedRecipesProvider from './Provider/PinnedRecipesProvider'
import RouterProvider from './Provider/RouterProvider'
import SelectedAttachementProvider from './Provider/SelectedAttachementProvider'
import UsersProvider from './Provider/UsersProvider'
import Container from './Shared/Container'

const AppProvider: FC = ({ children }) => (
    <RouterProvider>
        <DeviceOrientationProvider>
            <UsersProvider>
                <CategoriesCollectionProvider>
                    <GridProvider>
                        <SelectedAttachementProvider>
                            <AnimationProvider>
                                <PinnedRecipesProvider>{children}</PinnedRecipesProvider>
                            </AnimationProvider>
                        </SelectedAttachementProvider>
                    </GridProvider>
                </CategoriesCollectionProvider>
            </UsersProvider>
        </DeviceOrientationProvider>
    </RouterProvider>
)

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)
    const { user } = useFirebaseAuthContext()
    const { isMobile } = useBreakpointsContext()
    const colorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)')

    const setDarkTheme = useCallback(() => {
        const metaThemeColor = document.getElementsByName('theme-color')[0]
        setTheme(responsiveDarkTheme)
        metaThemeColor.setAttribute('content', '#424242')
    }, [])

    const setLigthTheme = useCallback(() => {
        const metaThemeColor = document.getElementsByName('theme-color')[0]
        setTheme(responsiveLightTheme)
        metaThemeColor.setAttribute('content', '#FFFFFF')
    }, [])

    useEffect(() => {
        if ((!user && colorSchemeDark) || isSafari) {
            setDarkTheme()
        } else if (user && user.muiTheme === 'dynamic') {
            if (colorSchemeDark) setDarkTheme()
            else setLigthTheme()
        } else if (user && user.muiTheme === 'dark') {
            setDarkTheme()
        } else if (user && user.muiTheme === 'light') {
            setLigthTheme()
        } else {
            setLigthTheme()
        }
    }, [colorSchemeDark, setDarkTheme, setLigthTheme, user])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                preventDuplicate
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: isMobile ? 'bottom' : 'top',
                    horizontal: 'right',
                }}>
                <AppProvider>
                    <Container>
                        <Header />
                        <Main />
                        <Footer />
                    </Container>
                </AppProvider>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App
