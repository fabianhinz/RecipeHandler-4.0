import {
    Button,
    createStyles,
    Hidden,
    IconButton,
    makeStyles,
    useMediaQuery,
    useTheme,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import LightThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import HomeIcon from '@material-ui/icons/HomeRounded'
import clsx from 'clsx'
import { Lightbulb } from 'mdi-material-ui'
import React, { memo } from 'react'

import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { usePinnedRecipesContext } from '../../Provider/PinnedRecipesProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { HeaderDispatch } from './HeaderReducer'

interface HeaderNavigationProps extends HeaderDispatch {
    onThemeChange: () => void
}
const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        },
        mobilePadding: {
            paddingRight: theme.spacing(5),
        },
        pinnedRecipes: {
            marginLeft: theme.spacing(40),
        },
    })
)

const HeaderNavigation = ({ dispatch, onThemeChange }: HeaderNavigationProps) => {
    const { user } = useFirebaseAuthContext()
    const { pinned } = usePinnedRecipesContext()

    const isMobilePadding = useMediaQuery('(max-width: 550px)')

    const theme = useTheme()
    const classes = useStyles()

    return (
        <div
            className={clsx(
                classes.container,
                pinned && classes.pinnedRecipes,
                isMobilePadding && user && !user.isAnonymous && classes.mobilePadding
            )}>
            <Hidden smDown>
                <Navigate to={PATHS.home}>
                    <Button size="large" startIcon={<HomeIcon />}>
                        Startseite
                    </Button>
                </Navigate>

                <Button
                    size="large"
                    startIcon={<Lightbulb />}
                    onClick={() => dispatch({ type: 'trialsChange' })}>
                    Merkzettel
                </Button>

                <Button
                    size="large"
                    startIcon={<AccountIcon />}
                    onClick={() => dispatch({ type: 'dialogChange' })}>
                    {user!.isAnonymous ? 'Einloggen' : 'Account'}
                </Button>

                <Button
                    size="large"
                    startIcon={
                        theme.palette.type === 'dark' ? <DarkThemeIcon /> : <LightThemeIcon />
                    }
                    onClick={onThemeChange}>
                    Theme
                </Button>
            </Hidden>

            <Hidden mdUp>
                <Navigate to={PATHS.home}>
                    <IconButton>
                        <HomeIcon />
                    </IconButton>
                </Navigate>
                <IconButton onClick={() => dispatch({ type: 'trialsChange' })}>
                    <Lightbulb />
                </IconButton>
                <IconButton onClick={() => dispatch({ type: 'dialogChange' })}>
                    <AccountIcon />
                </IconButton>
                <IconButton onClick={onThemeChange}>
                    {theme.palette.type === 'dark' ? <DarkThemeIcon /> : <LightThemeIcon />}
                </IconButton>
            </Hidden>
        </div>
    )
}

export default memo(HeaderNavigation)
