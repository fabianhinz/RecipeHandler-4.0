import {
    ButtonBase,
    Chip,
    createStyles,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core'
import BookIcon from '@material-ui/icons/Book'
import { BookmarkMultiple, BookSearch, Cart, Lightbulb } from 'mdi-material-ui'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useBookmarkContext } from './Provider/BookmarkProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import { useSearchResultsContext } from './Provider/SearchResultsProvider'
import { PATHS } from './Routes/Routes'
import { AlgoliaDocSearchRef } from './Search/Search'

interface StyleProps {
    active?: boolean
}

// Todo save-env-area
const useStyles = makeStyles(theme =>
    createStyles({
        nav: {
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            justifyContent: 'flex-start',
            top: 'calc(env(safe-area-inset-top) + 64px)',
            zIndex: theme.zIndex.appBar,
            width: 'calc(env(safe-area-inset-left) + 95px)',
            height: 'calc(100% - 64px)',
            paddingLeft: 'env(safe-area-inset-left)',
            overflowY: 'auto',
            backgroundColor: theme.palette.background.paper,
            left: 0,
        },
        label: { fontWeight: 600, fontFamily: 'Ubuntu' },
        button: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 8,
            borderRadius: 0,
            color: ({ active }: StyleProps) =>
                active
                    ? theme.palette.primary.main
                    : theme.palette.type === 'light'
                    ? 'rgba(0, 0, 0, 0.54)'
                    : 'inherit',
            height: 95,
            '@media (pointer: fine)': {
                '&:hover': {
                    backgroundColor: ({ active }: StyleProps) =>
                        active
                            ? 'inherit'
                            : theme.palette.type === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.08)',
                },
            },
        },
        drawerPaper: {
            paddingTop: 'env(safe-area-inset-top)',
            paddingLeft: 'env(safe-area-inset-left)',
            width: 320,
            display: 'flex',
            justifyContent: 'space-between',
        },
        listItem: {
            borderRadius: 0,
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        algoliaDocSearchRef: {
            padding: theme.spacing(2),
            textAlign: 'center',
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
    })
)

interface NavButtonProps {
    icon: JSX.Element
    pathname: string
    label: string
}

const NavButton = ({ pathname, label, icon }: NavButtonProps) => {
    const history = useHistory()
    const location = useLocation()
    const classes = useStyles({ active: location.pathname === pathname })

    const handleClick = () => {
        if (location.pathname === pathname) return
        history.push(pathname)
    }

    return (
        <ButtonBase onClick={handleClick} className={classes.button}>
            {icon}
            <Typography variant="caption" className={classes.label}>
                {label}
            </Typography>
        </ButtonBase>
    )
}

interface NavProps {
    drawerOpen: boolean
    onDrawerClose: () => void
}

const Nav = ({ drawerOpen, onDrawerClose }: NavProps) => {
    const classes = useStyles({})
    const history = useHistory()

    const { hits } = useSearchResultsContext()
    const { bookmarks } = useBookmarkContext()
    const { shoppingList } = useFirebaseAuthContext()

    const navigateTo = (pathname: string) => () => {
        onDrawerClose()
        history.push(pathname)
    }

    return (
        <>
            <Hidden xsDown>
                <nav className={classes.nav}>
                    <NavButton icon={<BookIcon />} label="Rezepte" pathname={PATHS.home} />
                    <NavButton
                        icon={<BookSearch />}
                        label="Ergebnisse"
                        pathname={PATHS.searchResults}
                    />
                    <NavButton icon={<Lightbulb />} label="Ideen" pathname={PATHS.trials} />
                    <NavButton
                        icon={<BookmarkMultiple />}
                        label="Lesezeichen"
                        pathname={PATHS.bookmarks}
                    />
                    <NavButton
                        icon={<Cart />}
                        label="Einkaufsliste"
                        pathname={PATHS.shoppingList}
                    />
                </nav>
            </Hidden>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={onDrawerClose}
                PaperProps={{ className: classes.drawerPaper }}>
                <List disablePadding>
                    <ListItem className={classes.listItem} button onClick={navigateTo(PATHS.home)}>
                        <ListItemIcon>
                            <BookIcon />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.label }} primary="Rezepte" />
                    </ListItem>

                    <ListItem
                        button
                        className={classes.listItem}
                        onClick={navigateTo(PATHS.searchResults)}>
                        <ListItemIcon>
                            <BookSearch />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.label }} primary="Ergebnisse" />
                        <ListItemSecondaryAction>
                            <Chip label={hits.length} />
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem
                        button
                        className={classes.listItem}
                        onClick={navigateTo(PATHS.trials)}>
                        <ListItemIcon>
                            <Lightbulb />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.label }} primary="Ideen" />
                    </ListItem>

                    <ListItem
                        button
                        className={classes.listItem}
                        onClick={navigateTo(PATHS.bookmarks)}>
                        <ListItemIcon>
                            <BookmarkMultiple />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.label }} primary="Lesezeichen" />
                        <ListItemSecondaryAction>
                            <Chip label={bookmarks.size} />
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem
                        button
                        className={classes.listItem}
                        onClick={navigateTo(PATHS.shoppingList)}>
                        <ListItemIcon>
                            <Cart />
                        </ListItemIcon>
                        <ListItemText
                            classes={{ primary: classes.label }}
                            primary="Einkaufsliste"
                        />
                        <ListItemSecondaryAction>
                            <Chip label={shoppingList.size} />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <div className={classes.algoliaDocSearchRef}>{AlgoliaDocSearchRef}</div>
            </Drawer>
        </>
    )
}

export default Nav
