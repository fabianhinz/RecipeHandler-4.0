import {
    Button,
    createStyles,
    Fab,
    Hidden,
    IconButton,
    makeStyles,
    useTheme,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import AddIcon from '@material-ui/icons/Add'
import LightThemeIcon from '@material-ui/icons/BrightnessHighRounded'
import DarkThemeIcon from '@material-ui/icons/BrightnessLowRounded'
import EditIcon from '@material-ui/icons/Edit'
import HomeIcon from '@material-ui/icons/HomeRounded'
import { Lightbulb } from 'mdi-material-ui'
import React, { memo } from 'react'
import { Route, Switch } from 'react-router-dom'

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
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        },
        addBtn: {
            position: 'absolute',
            top: -36,
            right: theme.spacing(3),
        },
    })
)

const HeaderNavigation = ({ dispatch, onThemeChange }: HeaderNavigationProps) => {
    const { user } = useFirebaseAuthContext()
    const theme = useTheme()
    const classes = useStyles()

    return (
        <div className={classes.container}>
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

            {user && !user.isAnonymous && (
                <div className={classes.addBtn}>
                    <Switch>
                        <Route
                            exact
                            path={PATHS.details()}
                            render={({ match }) => (
                                <Navigate to={PATHS.recipeEdit(match.params.name)}>
                                    <Fab color="secondary">
                                        <EditIcon />
                                    </Fab>
                                </Navigate>
                            )}
                        />
                        <Route
                            exact
                            path={PATHS.home}
                            render={() => (
                                <Navigate to={PATHS.recipeCreate}>
                                    <Fab color="secondary">
                                        <AddIcon />
                                    </Fab>
                                </Navigate>
                            )}
                        />
                    </Switch>
                </div>
            )}
        </div>
    )
}

export default memo(HeaderNavigation)
