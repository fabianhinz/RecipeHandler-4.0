import {
    AppBar,
    Avatar,
    createStyles,
    Hidden,
    IconButton,
    makeStyles,
    Slide,
    Toolbar,
    Tooltip,
    useScrollTrigger,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {
    AccountCircleOutline,
    EyeOffOutline,
    EyeOutline,
    InformationOutline,
    ViewAgendaOutline,
    ViewGridOutline,
} from 'mdi-material-ui'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import AccountAuthentication from './Account/AccountAuthentication'
import Nav from './Nav'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import { useGridContext } from './Provider/GridProvider'
import { PATHS } from './Routes/Routes'
import Search from './Search/Search'

interface StyleProps {
    scrolled: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        userAvatar: {
            height: 24,
            width: 24,
        },
        safeArea: {
            position: 'fixed',
            height: 'env(safe-area-inset-top)',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: theme.zIndex.appBar + 1,
        },
        appbar: {
            top: 'env(safe-area-inset-top)',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${
                theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'
            }`,
            boxShadow: 'unset',
        },
        toolbar: {
            minHeight: 64,
            [theme.breakpoints.only('xs')]: {
                padding: 0,
            },
        },
        header: {
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerButtons: {
            display: 'flex',
        },
        menuIcon: {
            [theme.breakpoints.up('md')]: {
                flexBasis: 239,
            },
        },
    })
)

const Header = () => {
    const [authenticationOpen, setAuthenticationOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const scrolled = useScrollTrigger({ target: window })
    const classes = useStyles()

    const history = useHistory()

    const { setGridLayout, gridLayout, compactLayout, setCompactLayout } = useGridContext()
    const { user, loginEnabled } = useFirebaseAuthContext()

    return (
        <>
            <div className={classes.safeArea} />
            <Slide appear={false} direction="down" in={!scrolled}>
                <AppBar className={classes.appbar} color="default" position="fixed">
                    <Toolbar className={classes.toolbar}>
                        <header className={classes.header}>
                            <div className={classes.menuIcon}>
                                <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                            <Search />
                            <div className={classes.headerButtons}>
                                <Hidden mdUp>
                                    <Tooltip
                                        title={compactLayout ? 'Detailansicht' : 'Kompaktansicht'}>
                                        <IconButton onClick={() => setCompactLayout(prev => !prev)}>
                                            {compactLayout ? <EyeOutline /> : <EyeOffOutline />}
                                        </IconButton>
                                    </Tooltip>
                                </Hidden>
                                <Hidden smDown>
                                    <Tooltip
                                        title={
                                            gridLayout === 'grid' ? 'Listenansicht' : 'Gridansicht'
                                        }>
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
                                </Hidden>

                                <Tooltip title="Impressum">
                                    <IconButton onClick={() => history.push(PATHS.impressum)}>
                                        <InformationOutline />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={user?.username || 'Einloggen'}>
                                    <div>
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
                                                <AccountCircleOutline />
                                            )}
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </div>
                        </header>
                    </Toolbar>
                </AppBar>
            </Slide>

            <AccountAuthentication
                open={authenticationOpen}
                onClose={() => setAuthenticationOpen(false)}
            />

            <Nav
                scrolled={scrolled}
                drawerOpen={drawerOpen}
                onDrawerClose={() => setDrawerOpen(false)}
            />
        </>
    )
}

export default Header
