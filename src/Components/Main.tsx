import { Box } from '@material-ui/core'
import React from 'react'

import { Routes } from './Routes/Routes'
import Container from './Shared/Container'

const Main = () => (
    <Container>
        <Box marginTop={4} marginBottom={11}>
            <Routes />
        </Box>
    </Container>
)

export default Main
