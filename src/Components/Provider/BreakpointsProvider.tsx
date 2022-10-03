import { useMediaQuery, useTheme } from '@material-ui/core'
import { createContext, FC, useContext } from 'react'

type Breakpoints = {
    isMobilePinnable: boolean
    isDesktopPinnable: boolean
    isDialogFullscreen: boolean
    isLowRes: boolean
    isHighRes: boolean
    isMobile: boolean
    mdUp: boolean
}

const Context = createContext<Breakpoints | null>(null)

export const useBreakpointsContext = () => useContext(Context) as Breakpoints

const BreakpointsProvider: FC = ({ children }) => {
    const theme = useTheme()

    const isDesktopPinnable = useMediaQuery('(min-width: 1024px)')
    const isMobilePinnable = useMediaQuery('(max-width: 1023px)')
    const isDialogFullscreen = useMediaQuery('(max-width: 1023px)')
    const isLowRes = useMediaQuery('(max-width: 599px)')
    const isHighRes = useMediaQuery('(min-width: 2560px)')
    const isMobile = useMediaQuery(`(max-width: 425px)`)
    const mdUp = useMediaQuery(theme.breakpoints.up('md'))

    return (
        <Context.Provider
            value={{
                isDesktopPinnable,
                isMobilePinnable,
                isDialogFullscreen,
                isLowRes,
                isHighRes,
                isMobile,
                mdUp,
            }}>
            {children}
        </Context.Provider>
    )
}

export default BreakpointsProvider
