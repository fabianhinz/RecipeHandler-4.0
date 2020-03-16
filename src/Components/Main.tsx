import {
    BottomNavigation,
    BottomNavigationAction,
    createStyles,
    makeStyles,
} from '@material-ui/core'
import BookIcon from '@material-ui/icons/Book'
import { BookmarkMultiple, Cart, Lightbulb } from 'mdi-material-ui'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { BORDER_RADIUS } from '../theme'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import { PATHS, Routes } from './Routes/Routes'
import { BackgroundIcon } from './Shared/BackgroundIcon'

const useStyles = makeStyles(theme =>
    createStyles({
        main: {
            minHeight: '40vh',
            [theme.breakpoints.only('xs')]: {
                padding: theme.spacing(2),
            },
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(3),
            },
            position: 'relative',
        },
        root: {
            marginTop: theme.spacing(3),
            backgroundColor: theme.palette.background.default,
            borderRadius: BORDER_RADIUS,
            [theme.breakpoints.only('xs')]: {
                marginLeft: -16,
                marginRight: -16,
            },
        },
        nav: {
            position: 'sticky',
            top: 'calc(env(safe-area-inset-top) + 24px)',
            zIndex: theme.zIndex.appBar,
        },
        navigation: {
            height: 64,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            boxShadow: theme.shadows[4],
        },
        navigationActionRoot: {
            borderRadius: 0,
            '&:first-child': {
                borderTopLeftRadius: BORDER_RADIUS,
            },
            '&:last-child': {
                borderTopRightRadius: BORDER_RADIUS,
            },
            minWidth: 'unset',
            maxWidth: 'unset',
        },
        navigationActionSelected: {
            fontWeight: 600,
        },
    })
)

const Main = () => {
    const classes = useStyles()

    const location = useLocation()
    const history = useHistory()
    const { user } = useFirebaseAuthContext()

    return (
        <>
            <div className={classes.root}>
                <nav className={classes.nav}>
                    <BottomNavigation
                        className={classes.navigation}
                        value={location.pathname}
                        onChange={(_e, path) => history.push(path)}>
                        <BottomNavigationAction
                            classes={{
                                root: classes.navigationActionRoot,
                                selected: classes.navigationActionSelected,
                            }}
                            label="Rezepte"
                            value={PATHS.home}
                            icon={<BookIcon />}
                        />
                        <BottomNavigationAction
                            classes={{
                                root: classes.navigationActionRoot,
                                selected: classes.navigationActionSelected,
                            }}
                            label="Ideen"
                            value={PATHS.trials}
                            icon={<Lightbulb />}
                        />
                        <BottomNavigationAction
                            classes={{
                                root: classes.navigationActionRoot,
                                selected: classes.navigationActionSelected,
                            }}
                            label="Lesezeichen"
                            value={PATHS.bookmarks}
                            icon={<BookmarkMultiple />}
                        />
                        <BottomNavigationAction
                            disabled={!user}
                            classes={{
                                root: classes.navigationActionRoot,
                                selected: classes.navigationActionSelected,
                            }}
                            label="Einkaufsliste"
                            value={PATHS.shoppingList}
                            icon={<Cart />}
                        />
                    </BottomNavigation>
                </nav>

                <main className={classes.main}>
                    <Routes />
                </main>
            </div>
            <BackgroundIcon />
        </>
    )
}

export default Main
