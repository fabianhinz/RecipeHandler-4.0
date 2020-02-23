import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../theme'
import { Routes } from './Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        main: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(10),
            backgroundColor: theme.palette.background.default,
            borderRadius: BORDER_RADIUS,
            [theme.breakpoints.only('xs')]: {
                padding: theme.spacing(2),
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
        <main>
            <div className={classes.main}>
                <Routes />
            </div>
        </main>
    )
}

export default Main
