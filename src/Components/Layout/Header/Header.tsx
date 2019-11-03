import { Drawer } from '@material-ui/core'
import React, { FC } from 'react'

import { HeaderLoginDialog } from './HeaderLoginDialog'
import { HeaderNavigation } from './HeaderNavigation'
import { useHeaderReducer } from './HeaderReducer'
import { HeaderTrials } from './Trials/HeaderTrials'

interface HeaderProps {
    onThemeChange: () => void
}

export const Header: FC<HeaderProps> = props => {
    const { state, dispatch } = useHeaderReducer()

    return (
        <>
            <Drawer variant="permanent" anchor="bottom">
                <HeaderNavigation dispatch={dispatch} onThemeChange={props.onThemeChange} />
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
