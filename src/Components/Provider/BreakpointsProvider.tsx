import { useMediaQuery } from '@material-ui/core'
import React, { FC, useContext } from 'react'

type Breakpoints = {
    isPinnable: boolean
    isDialogFullscreen: boolean
    isLowRes: boolean
    isHighRes: boolean
}

const Context = React.createContext<Breakpoints | null>(null)

export const useBreakpointsContext = () => useContext(Context) as Breakpoints

export const BreakpointsProvider: FC = ({ children }) => {
    const isPinnable = useMediaQuery('(min-width: 1024px)')
    const isDialogFullscreen = useMediaQuery('(max-width: 768px)')
    const isLowRes = useMediaQuery('(max-width: 599px)')
    const isHighRes = useMediaQuery('(min-width: 2560px)')

    return (
        <Context.Provider value={{ isPinnable, isDialogFullscreen, isLowRes, isHighRes }}>
            {children}
        </Context.Provider>
    )
}
