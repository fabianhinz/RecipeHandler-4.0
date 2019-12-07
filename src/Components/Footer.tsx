import { createStyles, Drawer, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

import Navigation from './Routes/Navigation'
import TrialsDialog from './Trials/TrialsDialog'
import UserDialog from './User/UserDialog'

interface HeaderProps {
    onThemeChange: () => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        drawerPaper: {
            overflowY: 'unset',
            height: theme.spacing(8),
        },
    })
)

const Footer = ({ onThemeChange }: HeaderProps) => {
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
                    onThemeChange={onThemeChange}
                    onOpenTrialsDialog={() => setTrialsDialogOpen(true)}
                    onOpenUserDialog={() => setUserDialogOpen(true)}
                />
            </Drawer>

            <UserDialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} />
            <TrialsDialog open={trialsDialogOpen} onClose={() => setTrialsDialogOpen(false)} />
        </>
    )
}

export default Footer
