import { Box } from '@material-ui/core'
import React from 'react'

import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { Routes } from '../Routes/Routes'

export const Main = () => {
    const { isDrawerBottom } = useBreakpointsContext()

    return (
        <Box marginTop={3} marginBottom={isDrawerBottom ? 9 : 3}>
            <Routes />
        </Box>
    )
}
