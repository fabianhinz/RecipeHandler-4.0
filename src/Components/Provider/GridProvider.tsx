import { GridSize } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import React, { FC, useContext, useState } from 'react'

export type GridLayout = 'list' | 'grid'

type GridContext = {
    setGridLayout: React.Dispatch<React.SetStateAction<GridLayout>>
    gridLayout: GridLayout
    gridBreakpointProps: Partial<Record<Breakpoint, boolean | GridSize>>
}

const Context = React.createContext<GridContext | null>(null)

export const useGridContext = () => useContext(Context) as GridContext

const GridProvider: FC = ({ children }) => {
    const [gridLayout, setGridLayout] = useState<GridLayout>('grid')

    return (
        <Context.Provider
            value={{
                gridLayout,
                setGridLayout,
                gridBreakpointProps: gridLayout === 'list' ? { xs: 12 } : { xs: 12, md: 6, xl: 4 },
            }}>
            {children}
        </Context.Provider>
    )
}

export default GridProvider
