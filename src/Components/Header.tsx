import {
    Avatar,
    createStyles,
    Drawer,
    Grid,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Paper,
    Tooltip,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import MenuIcon from '@material-ui/icons/Menu'
import { InformationOutline, ViewAgendaOutline, ViewGridOutline } from 'mdi-material-ui'
import React, { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import AccountAuthentication from './Account/AccountAuthentication'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import { useGridContext } from './Provider/GridProvider'
import { PATHS } from './Routes/Routes'
import Search, { AlgoliaDocSearchRef } from './Search/Search'

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            position: 'sticky',
            paddingTop: theme.spacing(3),
            '@media (max-width: 959px) and (orientation: landscape)': {
                position: 'static',
            },
            top: 'env(safe-area-inset-top)',
            zIndex: theme.zIndex.appBar,
        },
        searchPaper: {
            padding: theme.spacing(1),
            display: 'flex',
            position: 'relative',
            boxShadow: theme.shadows[4],
        },
        buttonPaper: {
            padding: theme.spacing(1),
            boxShadow: theme.shadows[4],
        },
        drawerPaper: {
            padding: theme.spacing(3),
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            minWidth: 250,
        },
        divider: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        userAvatar: {
            height: 24,
            width: 24,
        },
        drawerIcon: {
            flexShrink: 0,
            flexBasis: 48,
        },
    })
)

const Header = () => {
    const [authenticationOpen, setAuthenticationOpen] = useState(false)
    const [drawer, setDrawer] = useState(false)
    const classes = useStyles()

    const { setGridLayout, gridLayout } = useGridContext()
    const { user, loginEnabled } = useFirebaseAuthContext()
    const history = useHistory()

    const openDrawer = () => setDrawer(true)
    const closeDrawer = () => setDrawer(false)

    const mdUpActions = useMemo(
        () => (
            <Hidden smDown>
                <Grid item>
                    <Paper className={classes.buttonPaper}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <Tooltip
                                    title={gridLayout === 'grid' ? 'Listenansicht' : 'Gridansicht'}>
                                    <IconButton
                                        onClick={() =>
                                            setGridLayout(prev =>
                                                prev === 'grid' ? 'list' : 'grid'
                                            )
                                        }>
                                        {gridLayout === 'grid' ? (
                                            <ViewAgendaOutline />
                                        ) : (
                                            <ViewGridOutline />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Impressum">
                                    <IconButton onClick={() => history.push(PATHS.impressum)}>
                                        <InformationOutline />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    disabled={!loginEnabled}
                                    onClick={() => {
                                        if (user) history.push(PATHS.account)
                                        else setAuthenticationOpen(true)
                                    }}>
                                    {user ? (
                                        <Avatar
                                            className={classes.userAvatar}
                                            src={user.profilePicture}
                                        />
                                    ) : (
                                        <AccountIcon />
                                    )}
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Hidden>
        ),
        [
            classes.buttonPaper,
            classes.userAvatar,
            gridLayout,
            history,
            loginEnabled,
            setGridLayout,
            user,
        ]
    )

    const smDownActions = useMemo(
        () => (
            <Hidden mdUp>
                <Drawer
                    anchor="right"
                    open={drawer}
                    classes={{ paper: classes.drawerPaper }}
                    onClose={closeDrawer}>
                    {AlgoliaDocSearchRef}
                    <List onClick={closeDrawer}>
                        <ListItem
                            button
                            onClick={() =>
                                setGridLayout(prev => (prev === 'grid' ? 'list' : 'grid'))
                            }>
                            <ListItemIcon>
                                {gridLayout === 'grid' ? (
                                    <ViewAgendaOutline />
                                ) : (
                                    <ViewGridOutline />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={gridLayout === 'grid' ? 'Listenansicht' : 'Gridansicht'}
                            />
                        </ListItem>

                        <ListItem button onClick={() => history.push(PATHS.impressum)}>
                            <ListItemIcon>
                                <InformationOutline />
                            </ListItemIcon>
                            <ListItemText primary="Impressum" />
                        </ListItem>
                        <ListItem
                            button
                            disabled={!loginEnabled}
                            onClick={() => {
                                if (user) history.push(PATHS.account)
                                else setAuthenticationOpen(true)
                            }}>
                            <ListItemIcon>
                                {user ? (
                                    <Avatar
                                        className={classes.userAvatar}
                                        src={user.profilePicture}
                                    />
                                ) : (
                                    <AccountIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={user?.username || 'Einloggen'} />
                        </ListItem>
                    </List>
                </Drawer>
            </Hidden>
        ),
        [
            classes.drawerPaper,
            classes.userAvatar,
            drawer,
            gridLayout,
            history,
            loginEnabled,
            setGridLayout,
            user,
        ]
    )

    return (
        <>
            <header className={classes.header}>
                <Grid container spacing={3} justify="space-between">
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper className={classes.searchPaper}>
                            <Search />
                            <Hidden mdUp>
                                <IconButton className={classes.drawerIcon} onClick={openDrawer}>
                                    <MenuIcon />
                                </IconButton>
                            </Hidden>
                        </Paper>
                    </Grid>
                    {mdUpActions}
                </Grid>
            </header>

            {smDownActions}
            <AccountAuthentication
                open={authenticationOpen}
                onClose={() => setAuthenticationOpen(false)}
            />
        </>
    )
}

export default Header
