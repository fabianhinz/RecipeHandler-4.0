import { useMediaQuery } from '@material-ui/core'
import React, { FC, useContext } from 'react'

type Breakpoints = {
    isMobilePinnable: boolean
    isDesktopPinnable: boolean
    isDialogFullscreen: boolean
    isLowRes: boolean
    isHighRes: boolean
}

const Context = React.createContext<Breakpoints | null>(null)

export const useBreakpointsContext = () => useContext(Context) as Breakpoints

const BreakpointsProvider: FC = ({ children }) => {
    const isDesktopPinnable = useMediaQuery('(min-width: 1024px)')
    const isMobilePinnable = useMediaQuery('(max-width: 1023px)')
    const isDialogFullscreen = useMediaQuery('(max-width: 768px)')
    const isLowRes = useMediaQuery('(max-width: 599px)')
    const isHighRes = useMediaQuery('(min-width: 2560px)')

    return (
        <Context.Provider
            value={{
                isDesktopPinnable,
                isMobilePinnable,
                isDialogFullscreen,
                isLowRes,
                isHighRes,
            }}>
            {children}
        </Context.Provider>
    )
}

export default BreakpointsProvider
