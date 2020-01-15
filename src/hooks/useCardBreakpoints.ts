import { GridSize } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { useMemo } from 'react'

interface useCardBreakpointsOptions {
    xsOnly?: boolean
    xlEnabled?: boolean
}

const useCardBreakpoints = ({ xsOnly, xlEnabled }: useCardBreakpointsOptions) => {
    return {
        breakpoints: useMemo(
            () => (xsOnly ? { xs: 12 } : { xs: 12, lg: 6, xl: xlEnabled ? 4 : 6 }),
            [xsOnly, xlEnabled]
        ) as Partial<Record<Breakpoint, boolean | GridSize>>,
    }
}

export default useCardBreakpoints
