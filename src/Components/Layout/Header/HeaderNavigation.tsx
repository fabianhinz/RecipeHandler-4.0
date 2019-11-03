import { IconButton, Tooltip, Zoom } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleOutlined'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import BrightnessIcon from '@material-ui/icons/SettingsBrightnessOutlined'
import { createStyles, makeStyles } from '@material-ui/styles'
import { LightbulbOutline } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { HeaderDispatch } from './HeaderReducer'

interface HeaderNavigationProps extends HeaderDispatch {
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
    })
)

export const HeaderNavigation: FC<HeaderNavigationProps> = ({ onThemeChange, dispatch }) => {
    const { user } = useFirebaseAuthContext()
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Navigate to={PATHS.home}>
                <Tooltip TransitionComponent={Zoom} title="Startseite">
                    <IconButton>
                        <HomeIcon />
                    </IconButton>
                </Tooltip>
            </Navigate>

            <Tooltip TransitionComponent={Zoom} title="Theme wechseln">
                <IconButton onClick={onThemeChange}>
                    <BrightnessIcon />
                </IconButton>
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title="Versuchskaninchen">
                <IconButton onClick={() => dispatch({ type: 'trialsChange' })}>
                    <LightbulbOutline />
                </IconButton>
            </Tooltip>

            {user && !user.isAnonymous && (
                <Navigate to={PATHS.recipeCreate}>
                    <Tooltip TransitionComponent={Zoom} title="Rezept anlegen">
                        <IconButton>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Navigate>
            )}

            <Tooltip TransitionComponent={Zoom} title="Einloggen">
                <IconButton onClick={() => dispatch({ type: 'dialogChange' })}>
                    <AccountIcon />
                </IconButton>
            </Tooltip>
        </div>
    )
}
