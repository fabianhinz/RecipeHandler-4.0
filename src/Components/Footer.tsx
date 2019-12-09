import { AppBar, createStyles, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

import AccountDialog from './Account/AccountDialog'
import Navigation from './Routes/Navigation'
import TrialsDialog from './Trials/TrialsDialog'

const useStyles = makeStyles(theme =>
    createStyles({
        appbar: {
            position: 'fixed',
            bottom: 0,
            top: 'auto',
            height: theme.spacing(8),
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

            <AccountDialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} />
            <TrialsDialog open={trialsDialogOpen} onClose={() => setTrialsDialogOpen(false)} />
        </>
    )
}

export default Footer
