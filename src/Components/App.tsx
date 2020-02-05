import { useMediaQuery } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { Recipe, RecipeDocument } from '../model/model'
import { FirebaseService } from '../services/firebase'
import { responsiveDarkTheme, responsiveLightTheme } from '../theme'
import { isSafari } from '../util/constants'
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import BookmarkProvider from './Provider/BookmarkProvider'
import { useBreakpointsContext } from './Provider/BreakpointsProvider'
import CategoriesCollectionProvider from './Provider/CategoriesCollectionProvider'
import DeviceOrientationProvider from './Provider/DeviceOrientationProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import GridProvider from './Provider/GridProvider'
import RouterProvider from './Provider/RouterProvider'
import SelectedAttachementProvider from './Provider/SelectedAttachementProvider'
import SwipeableAttachmentProvider from './Provider/SwipeableAttachmentProvider'
import UsersProvider from './Provider/UsersProvider'
import Container from './Shared/Container'

const AppProvider: FC = ({ children }) => (
    <RouterProvider>
        <DeviceOrientationProvider>
            <UsersProvider>
                <CategoriesCollectionProvider>
                    <GridProvider>
                        <SelectedAttachementProvider>
                            <SwipeableAttachmentProvider>
                                <BookmarkProvider>{children}</BookmarkProvider>
                            </SwipeableAttachmentProvider>
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

    // useEffect(() => {
    //     FirebaseService.firestore
    //         .collection('recipes')
    //         .get()
    //         .then(recipes => {
    //             recipes.forEach(recipeDoc => {
    //                 const recipe = recipeDoc.data() as RecipeDocument
    //                 if (recipe.attachments.length > 0) {
    //                     recipe.attachments.forEach(
    //                         attachment => (attachment.editorUid = 'fY6g8kg5RmYuhvoTC6rlkzES89h1')
    //                     )
    //                     FirebaseService.firestore
    //                         .collection('recipes')
    //                         .doc(recipeDoc.id)
    //                         .update({ attachments: recipe.attachments })
    //                 }
    //             })
    //         })
    // }, [])

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
