import {
  StyledEngineProvider,
  Theme,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { ReactNode, useLayoutEffect, useState } from 'react'

import {
  responsiveBlackTheme,
  responsiveDarkTheme,
  responsiveLightTheme,
} from '@/theme'

import { useFirebaseAuthContext } from './FirebaseAuthProvider'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

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

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </StyledEngineProvider>
  )
}
