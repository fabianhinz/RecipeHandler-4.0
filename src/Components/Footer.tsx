import { AppBar, createStyles, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

import AccountDialog from './Account/AccountDialog'
import Navigation from './Routes/Navigation'
import TrialsDialog from './Trials/TrialsDialog'

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
            background: theme.palette.type === 'dark' ? '#212121' : '#fff',
        },
    })
)

const Footer = () => {
    const [userDialogOpen, setUserDialogOpen] = useState(false)
    const [trialsDialogOpen, setTrialsDialogOpen] = useState(false)

    const classes = useStyles()

    return (
        <>
            <AppBar className={classes.appbar} color="default">
                <Navigation
                    onOpenTrialsDialog={() => setTrialsDialogOpen(true)}
                    onOpenUserDialog={() => setUserDialogOpen(true)}
                />
            </AppBar>
            <div className={classes.safeAreaIos} />

            <AccountDialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} />
            <TrialsDialog open={trialsDialogOpen} onClose={() => setTrialsDialogOpen(false)} />
        </>
    )
}

export default Footer
