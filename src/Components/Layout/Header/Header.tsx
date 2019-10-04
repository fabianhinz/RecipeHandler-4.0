import { Drawer } from '@material-ui/core'
import React, { FC } from 'react'

import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { HeaderLoginDialog } from './HeaderLoginDialog'
import { HeaderNavigation } from './HeaderNavigation'
import { useHeaderReducer } from './HeaderReducer'
import { HeaderTrials } from './Trials/HeaderTrials'

interface HeaderProps {
    onThemeChange: () => void
}

export const Header: FC<HeaderProps> = props => {
    const { state, dispatch } = useHeaderReducer()
    const { isDrawerBottom } = useBreakpointsContext()

    return (
        <>
            <Drawer variant="permanent" anchor={isDrawerBottom ? 'bottom' : 'right'}>
                <HeaderNavigation
                    drawerRight={!isDrawerBottom}
                    dispatch={dispatch}
                    onThemeChange={props.onThemeChange}
                />
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
