import { AppBar, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import Navigation from './Routes/Navigation'

const useStyles = makeStyles(theme =>
    createStyles({
        appbar: {
            position: 'fixed',
            top: 'auto',
            bottom: 'env(safe-area-inset-bottom)',
            height: theme.spacing(8),
        },
        safeAreaIos: {
            zIndex: theme.zIndex.appBar,
            position: 'fixed',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'env(safe-area-inset-bottom)',
            background: theme.palette.type === 'dark' ? '#212121' : '#f5f5f5',
        },
    })
)

const Footer = () => {
    const classes = useStyles()

    return (
        <footer>
            <AppBar className={classes.appbar} color="default">
                <Navigation />
            </AppBar>
            <div className={classes.safeAreaIos} />
        </footer>
    )
}

export default Footer
