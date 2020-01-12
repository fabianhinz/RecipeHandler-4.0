import { Box } from '@material-ui/core'
import React from 'react'

import { useRouterContext } from './Provider/RouterProvider'
import { PATHS, Routes } from './Routes/Routes'
import Search from './Search/Search'

const Main = () => {
    const { location } = useRouterContext()

    return (
        <Box marginTop={3} marginBottom={11}>
            {location.pathname !== PATHS.account && <Search />}
            <Routes />
        </Box>
    )
}

export default Main
