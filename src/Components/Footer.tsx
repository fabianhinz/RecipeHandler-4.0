import { createStyles, Drawer, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

import AccountDialog from './Account/AccountDialog'
import Navigation from './Routes/Navigation'
import TrialsDialog from './Trials/TrialsDialog'

const useStyles = makeStyles(theme =>
    createStyles({
        drawerPaper: {
            overflowY: 'unset',
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
            <Drawer
                PaperProps={{ classes: { root: classes.drawerPaper } }}
                variant="permanent"
                anchor="bottom">
                <Navigation
                    onOpenTrialsDialog={() => setTrialsDialogOpen(true)}
                    onOpenUserDialog={() => setUserDialogOpen(true)}
                />
            </Drawer>

            <AccountDialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} />
            <TrialsDialog open={trialsDialogOpen} onClose={() => setTrialsDialogOpen(false)} />
        </>
    )
}

export default Footer
