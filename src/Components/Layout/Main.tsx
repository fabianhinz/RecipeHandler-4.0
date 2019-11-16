import { Box } from '@material-ui/core'
import React from 'react'

import { HomeSearch } from '../Home/HomeSearch/HomeSearch'
import { Routes } from '../Routes/Routes'

export const Main = () => (
    <Box marginTop={3} marginBottom={11}>
        <HomeSearch />
        <Routes />
    </Box>
)
