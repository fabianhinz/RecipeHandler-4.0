import { IconButton } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleOutlined'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import BrightnessIcon from '@material-ui/icons/SettingsBrightnessOutlined'
import { createStyles, makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { LightbulbOutline } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { HeaderDispatch } from './HeaderReducer'

interface HeaderNavigationProps extends HeaderDispatch {
    drawerRight: boolean
    onThemeChange: () => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        drawerRight: {
            flexDirection: 'column',
        },
    })
)

export const HeaderNavigation: FC<HeaderNavigationProps> = ({
    onThemeChange,
    dispatch,
    drawerRight,
}) => {
    const { user } = useFirebaseAuthContext()
    const classes = useStyles()

    return (
        <div className={clsx(classes.container, drawerRight && classes.drawerRight)}>
            <Navigate to={PATHS.home}>
                <IconButton>
                    <HomeIcon />
                </IconButton>
            </Navigate>

            <IconButton onClick={onThemeChange}>
                <BrightnessIcon />
            </IconButton>

            {user && (
                <>
                    <IconButton onClick={() => dispatch({ type: 'trialsChange' })}>
                        <LightbulbOutline />
                    </IconButton>
                    <Navigate to={PATHS.recipeCreate}>
                        <IconButton>
                            <AddIcon />
                        </IconButton>
                    </Navigate>
                </>
            )}

            <IconButton onClick={() => dispatch({ type: 'dialogChange' })}>
                <AccountIcon />
            </IconButton>
        </div>
    )
}
