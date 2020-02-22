import { Box } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'

import * as serviceWorker from '../serviceWorker'
import { Routes } from './Routes/Routes'

const Main = () => {
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        serviceWorker.register({
            onSuccess: () =>
                enqueueSnackbar('Die Anwendung kann nun offline verwendet werden', {
                    variant: 'info',
                }),
            onUpdate: () =>
                enqueueSnackbar(
                    'Eine neue Version der Anwendung wird beim nächsten Start verwendet',
                    { variant: 'info' }
                ),
        })
    }, [enqueueSnackbar])

    return (
        <main>
            <Box marginTop={2} marginBottom={10}>
                <Routes />
            </Box>
        </main>
    )
}

export default Main
