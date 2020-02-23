import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../theme'
import { Routes } from './Routes/Routes'
import { BackgroundIcon } from './Shared/BackgroundIcon'

const useStyles = makeStyles(theme =>
    createStyles({
        main: {
            marginBottom: theme.spacing(8),
            backgroundColor: theme.palette.background.default,
            borderRadius: BORDER_RADIUS,
            [theme.breakpoints.only('xs')]: {
                padding: theme.spacing(2),
                marginLeft: -16,
                marginRight: -16,
            },
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(3),
            },
            minHeight: '40vh',
        },
    })
)

const Main = () => {
    const classes = useStyles()

    return (
        <>
            <main>
                <div className={classes.main}>
                    <Routes />
                </div>
            </main>
            <BackgroundIcon />
        </>
    )
}

export default Main
