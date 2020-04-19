import { useMediaQuery } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import useIntersectionObserver from '../hooks/useIntersectionObserver'
import recipeService from '../services/recipeService'
import { responsiveBlackTheme, responsiveDarkTheme, responsiveLightTheme } from '../theme'
import Header from './Header'
import Main from './Main'
import AttachmentGalleryProvider from './Provider/AttachmentGalleryProvider'
import BookmarkProvider from './Provider/BookmarkProvider'
import CategoriesCollectionProvider from './Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from './Provider/DeviceOrientationProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import GridProvider from './Provider/GridProvider'
import RouterProvider from './Provider/RouterProvider'
import SearchResultsProvider from './Provider/SearchResultsProvider'
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
                                <BookmarkProvider>
                                    <SearchResultsProvider>{children}</SearchResultsProvider>
                                </BookmarkProvider>
                            </AttachmentGalleryProvider>
                        </SelectedAttachementProvider>
                    </GridProvider>
                </CategoriesCollectionProvider>
            </UsersProvider>
        </DeviceOrientationProvider>
    </RouterProvider>
)

const App: FC = () => {
    const [theme, setTheme] = useState(responsiveLightTheme)
    const [scrolled, setScrolled] = useState(false)

    const { user } = useFirebaseAuthContext()
    const colorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)')
    const location = useLocation()

    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setScrolled(false),
        onLeave: () => setScrolled(true),
    })

    const setDarkTheme = useCallback(() => {
        const metaThemeColor = document.getElementsByName('theme-color')[0]
        setTheme(responsiveDarkTheme)
        metaThemeColor.setAttribute('content', '#424242')
    }, [])

    const setLightTheme = useCallback(() => {
        const metaThemeColor = document.getElementsByName('theme-color')[0]
        setTheme(responsiveLightTheme)
        metaThemeColor.setAttribute('content', '#FFFFFF')
    }, [])

    const setBlackTheme = useCallback(() => {
        const metaThemeColor = document.getElementsByName('theme-color')[0]
        setTheme(responsiveBlackTheme)
        metaThemeColor.setAttribute('content', '#000')
    }, [])

    useEffect(() => {
        if (!user && colorSchemeDark) {
            setDarkTheme()
        } else if (user && user.muiTheme === 'dynamic') {
            if (colorSchemeDark) setDarkTheme()
            else setLightTheme()
        } else if (user && user.muiTheme === 'dark') {
            setDarkTheme()
        } else if (user && user.muiTheme === 'light') {
            setLightTheme()
        } else if (user && user.muiTheme === 'black') {
            setBlackTheme()
        } else {
            setLightTheme()
        }
    }, [colorSchemeDark, setBlackTheme, setDarkTheme, setLightTheme, user])

    useEffect(() => {
        const scrollPosition = recipeService.scrollPosition.get(location.pathname)
        if (scrollPosition) window.scrollTo({ top: scrollPosition, behavior: 'auto' })
        else window.scrollTo({ top: 0, behavior: 'auto' })
    }, [location.pathname])

    useEffect(() => {
        window.onscroll = () => {
            recipeService.scrollPosition.set(location.pathname, window.scrollY)
        }

        return () => {
            window.onscroll = null
        }
    }, [location.pathname])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                preventDuplicate
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                <AppProvider>
                    <Header scrolled={scrolled} />
                    <IntersectionObserverTrigger />
                    <Main />
                </AppProvider>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App
