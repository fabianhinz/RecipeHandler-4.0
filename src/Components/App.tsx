import { useMediaQuery } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import { FC, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Header from '@/Components/Header'
import Main from '@/Components/Main'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import recipeService from '@/services/recipeService'
import { SwUpdates } from '@/SwUpdates'
import { responsiveBlackTheme, responsiveDarkTheme, responsiveLightTheme } from '@/theme'

import { AppProvider } from './AppProvider'

const App: FC = () => {
  const [theme, setTheme] = useState(responsiveLightTheme)

  const { user } = useFirebaseAuthContext()
  const colorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)')
  const location = useLocation()

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
          horizontal: 'center',
        }}>
        <AppProvider>
          <Header />
          <Main />
          <SwUpdates />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
