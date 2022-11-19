import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@material-ui/core'
import { ReactNode, useLayoutEffect, useState } from 'react'

import { responsiveBlackTheme, responsiveDarkTheme, responsiveLightTheme } from '@/theme'

import { useFirebaseAuthContext } from './FirebaseAuthProvider'

interface Props {
  children: ReactNode
}

export const ThemeProvider = (props: Props) => {
  const [theme, setTheme] = useState(responsiveLightTheme)
  const colorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)')
  const { user } = useFirebaseAuthContext()

  useLayoutEffect(() => {
    const setDarkTheme = () => {
      const metaThemeColor = document.getElementsByName('theme-color')[0]
      setTheme(responsiveDarkTheme)
      metaThemeColor.setAttribute('content', '#424242')
    }

    const setLightTheme = () => {
      const metaThemeColor = document.getElementsByName('theme-color')[0]
      setTheme(responsiveLightTheme)
      metaThemeColor.setAttribute('content', '#FFFFFF')
    }

    const setBlackTheme = () => {
      const metaThemeColor = document.getElementsByName('theme-color')[0]
      setTheme(responsiveBlackTheme)
      metaThemeColor.setAttribute('content', '#000')
    }

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
  }, [colorSchemeDark, user])

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
}
