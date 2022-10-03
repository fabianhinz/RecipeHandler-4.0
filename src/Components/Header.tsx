import { AppBar, Avatar, Hidden, IconButton, makeStyles, Toolbar, Tooltip } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {
    AccountCircleOutline,
    EyeOffOutline,
    EyeOutline,
    InformationOutline,
    ViewAgendaOutline,
    ViewGridOutline,
} from 'mdi-material-ui'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import AccountAuthentication from '@/Components/Account/AccountAuthentication'
import Nav from '@/Components/Nav'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { PATHS } from '@/Components/Routes/Routes'
import Search from '@/Components/Search/Search'

const useStyles = makeStyles(theme => ({
    userAvatar: {
        height: 40,
        width: 40,
        border: `2px solid ${theme.palette.divider}`,
        marginLeft: theme.spacing(1),
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
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerButtons: {
        display: 'flex',
        alignItems: 'center',
    },
    menuIcon: {
        [theme.breakpoints.up('md')]: {
            flexBasis: 239,
        },
    },
    accountContainer: {
        cursor: 'pointer',
    },
}))

const Header = () => {
    const [authenticationOpen, setAuthenticationOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const classes = useStyles()

    const history = useHistory()

    const { setGridLayout, gridLayout, compactLayout, setCompactLayout } = useGridContext()
    const { user, loginEnabled } = useFirebaseAuthContext()

    return (
        <>
            <div className={classes.safeArea} />

            <AppBar variant="elevation" className={classes.appbar} color="default" position="fixed">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.menuIcon}>
                        <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                            <MenuIcon />
                        </IconButton>
                    </div>

                    <Search />

                    <div className={classes.headerButtons}>
                        <Hidden mdUp>
                            <Tooltip title={compactLayout ? 'Detailansicht' : 'Kompaktansicht'}>
                                <IconButton onClick={() => setCompactLayout(prev => !prev)}>
                                    {compactLayout ? <EyeOutline /> : <EyeOffOutline />}
                                </IconButton>
                            </Tooltip>
                        </Hidden>
                        <Hidden smDown>
                            <Tooltip
                                title={gridLayout === 'grid' ? 'Listenansicht' : 'Gridansicht'}>
                                <IconButton
                                    onClick={() =>
                                        setGridLayout(prev => (prev === 'grid' ? 'list' : 'grid'))
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
                            <div
                                className={classes.accountContainer}
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
                                    <IconButton disabled={!loginEnabled}>
                                        <AccountCircleOutline />
                                    </IconButton>
                                )}
                            </div>
                        </Tooltip>
                    </div>
                </Toolbar>
            </AppBar>

            <AccountAuthentication
                open={authenticationOpen}
                onClose={() => setAuthenticationOpen(false)}
            />

            <Nav drawerOpen={drawerOpen} onDrawerClose={() => setDrawerOpen(false)} />
        </>
    )
}

export default Header
