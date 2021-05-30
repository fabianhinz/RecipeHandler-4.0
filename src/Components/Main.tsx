import { Container, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import { BORDER_RADIUS } from '../theme'
import { PATHS, Routes } from './Routes/Routes'

const useStyles = makeStyles<Theme, { extraPadding?: boolean }>(theme => ({
    main: {
        minHeight: '60vh',
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[2],
        borderRadius: BORDER_RADIUS,
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
        padding: '64px 0px',
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            paddingTop: props => (props.extraPadding ? 256 : 128) + theme.spacing(3),
        },
        '@media (min-width: 1440px)': {
            maxWidth: 1440,
        },
        '@media (min-width: 2560px)': {
            maxWidth: 2560,
        },
    },
}))

const Main = () => {
    const match = useRouteMatch<{ name: string }>([PATHS.recipeEdit(), PATHS.details()])
    const classes = useStyles({ extraPadding: match?.isExact })

    return (
        <Container className={classes.container}>
            <main className={classes.main}>
                <Routes />
            </main>
        </Container>
    )
}

export default Main
