import { Container, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../theme'
import { Routes } from './Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        main: {
            minHeight: '40vh',
            backgroundColor: theme.palette.background.default,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            [theme.breakpoints.only('xs')]: {
                padding: theme.spacing(2),
            },
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(3),
                marginLeft: 'calc(env(safe-area-inset-left) + 95px)',
            },
        },
        container: {
            userSelect: 'none',
            padding: 0,
            paddingTop: 64,
            [theme.breakpoints.up('sm')]: {
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3),
                paddingTop: 64 + theme.spacing(3),
            },
            '@media (min-width: 2560px)': {
                maxWidth: 2560,
            },
        },
    })
)

const Main = () => {
    const classes = useStyles()

    return (
        <Container className={classes.container} maxWidth="xl">
            <main className={classes.main}>
                <Routes />
            </main>
        </Container>
    )
}

export default Main
