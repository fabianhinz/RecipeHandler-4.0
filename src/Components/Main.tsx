import {
    BottomNavigation,
    BottomNavigationAction,
    createStyles,
    makeStyles,
} from '@material-ui/core'
import BookIcon from '@material-ui/icons/Book'
import { BookmarkMultiple, Cart, Lightbulb } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { BORDER_RADIUS } from '../theme'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import { PATHS, Routes } from './Routes/Routes'
import { BackgroundIcon } from './Shared/BackgroundIcon'

const useStyles = makeStyles(theme =>
    createStyles({
        main: {
            minHeight: '40vh',
            overflowY: 'auto',
            maxHeight: `calc(100vh - 64px - 112px )`,
            [theme.breakpoints.only('xs')]: {
                padding: theme.spacing(2),
            },
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(3),
            },
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

        navigation: {
            height: 64,
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
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

    const handleMainScroll = (event: React.UIEvent<HTMLElement>) => {
        if (location.pathname === PATHS.home) console.log(event.currentTarget.scrollTop)
    }

    return (
        <>
            <div className={classes.root}>
                <nav>
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

                <main onScroll={handleMainScroll} className={classes.main}>
                    <Routes />
                </main>
            </div>
            <BackgroundIcon />
        </>
    )
}

export default Main
