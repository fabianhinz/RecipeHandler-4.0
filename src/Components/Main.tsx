import { Container, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../theme'
import { Routes } from './Routes/Routes'
import { BackgroundIcon } from './Shared/BackgroundIcon'

const useStyles = makeStyles(theme =>
    createStyles({
        main: {
            minHeight: '40vh',
            position: 'relative',
            backgroundColor: theme.palette.background.default,
            [theme.breakpoints.only('xs')]: {
                padding: theme.spacing(2),
            },
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(3),
                borderRadius: BORDER_RADIUS,
                marginLeft: 'calc(env(safe-area-inset-left) + 95px)',
            },
        },
        container: {
            userSelect: 'none',
            marginTop: 88,
            [theme.breakpoints.only('xs')]: {
                marginTop: 64,
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    })
)

const Main = () => {
    const classes = useStyles()

    return (
        <>
            <Container className={classes.container} maxWidth="xl">
                <main className={classes.main}>
                    <Routes />
                </main>
            </Container>
            <BackgroundIcon />
        </>
    )
}

export default Main
