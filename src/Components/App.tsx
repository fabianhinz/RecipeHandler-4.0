import { Container, createStyles, makeStyles, useMediaQuery } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import { isSafari } from '../util/constants'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import OnRouteChangeScrollToTop from './OnRouteChangeScrollToTop'
import AttachmentGalleryProvider from './Provider/AttachmentGalleryProvider'
import BookmarkProvider from './Provider/BookmarkProvider'
import { useBreakpointsContext } from './Provider/BreakpointsProvider'
import CategoriesCollectionProvider from './Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from './Provider/DeviceOrientationProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import GridProvider from './Provider/GridProvider'
import RouterProvider from './Provider/RouterProvider'
import SelectedAttachementProvider from './Provider/SelectedAttachementProvider'
import UsersProvider from './Provider/UsersProvider'

const AppProvider: FC = ({ children }) => (
    <RouterProvider>
        <DeviceOrientationProvider>
            <UsersProvider>
                <CategoriesCollectionProvider>
                    <GridProvider>
                        <SelectedAttachementProvider>
                            <AttachmentGalleryProvider>
                                <BookmarkProvider>{children}</BookmarkProvider>
                            </AttachmentGalleryProvider>
                        </SelectedAttachementProvider>
                    </GridProvider>
                </CategoriesCollectionProvider>
            </UsersProvider>
        </DeviceOrientationProvider>
    </RouterProvider>
)

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            userSelect: 'none',
        },
    })
)

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)

    const classes = useStyles()

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
            <OnRouteChangeScrollToTop />
            <SnackbarProvider
                preventDuplicate
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: isMobile ? 'bottom' : 'top',
                    horizontal: 'right',
                }}>
                <AppProvider>
                    <Container className={classes.root} maxWidth="xl">
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
