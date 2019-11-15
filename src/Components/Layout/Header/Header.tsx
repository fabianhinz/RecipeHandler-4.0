import { createStyles, Drawer, makeStyles } from '@material-ui/core'
import React from 'react'

import HeaderLoginDialog from './HeaderLoginDialog'
import HeaderNavigation from './HeaderNavigation'
import { useHeaderReducer } from './HeaderReducer'
import HeaderTrials from './Trials/HeaderTrials'

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

export const Header = ({ onThemeChange }: HeaderProps) => {
    const { state, dispatch } = useHeaderReducer()
    const classes = useStyles()

    return (
        <>
            <Drawer
                PaperProps={{ classes: { root: classes.drawerPaper } }}
                variant="permanent"
                anchor="bottom">
                <HeaderNavigation dispatch={dispatch} onThemeChange={onThemeChange} />
            </Drawer>

            <HeaderLoginDialog
                dialogOpen={state.dialogOpen}
                email={state.email}
                password={state.password}
                dispatch={dispatch}
            />

            <HeaderTrials trialsOpen={state.trialsOpen} dispatch={dispatch} />
        </>
    )
}
