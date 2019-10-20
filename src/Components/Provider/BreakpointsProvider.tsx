import { useMediaQuery } from '@material-ui/core'
import React, { FC, useContext } from 'react'

type Breakpoints = {
    isDrawerBottom: boolean
    isDraggableRecipes: boolean
    isDialogFullscreen: boolean
    isMobile: boolean
    isHighRes: boolean
}

const Context = React.createContext<Breakpoints | null>(null)

export const useBreakpointsContext = () => useContext(Context) as Breakpoints

export const BreakpointsProvider: FC = ({ children }) => {
    const isDrawerBottom = useMediaQuery('(max-width: 1400px)')
    const isDraggableRecipes = useMediaQuery('(min-width: 768px)')
    const isDialogFullscreen = useMediaQuery('(max-width: 768px)')
    const isMobile = useMediaQuery('(max-width: 599px)')
    const isHighRes = useMediaQuery('(min-width: 2560px)')

    return (
        <Context.Provider
            value={{ isDrawerBottom, isDraggableRecipes, isDialogFullscreen, isMobile, isHighRes }}>
            {children}
        </Context.Provider>
    )
}
