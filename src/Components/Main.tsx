import { Box } from '@material-ui/core'
import React from 'react'

import { Routes } from './Routes/Routes'
import Search from './Search/Search'

const Main = () => (
    <Box marginTop={3} marginBottom={11}>
        <Search />
        <Box paddingTop={1} paddingBottom={1}>
            <Routes />
        </Box>
    </Box>
)

export default Main
