import {
    createStyles,
    Divider,
    Grid,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Paper,
    SwipeableDrawer,
    Tooltip,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined'
import {
    BookmarkMultipleOutline,
    InformationOutline,
    ViewAgendaOutline,
    ViewGridOutline,
} from 'mdi-material-ui'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useBookmarkContext } from './Provider/BookmarkProvider'
import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import { useGridContext } from './Provider/GridProvider'
import { PATHS } from './Routes/Routes'
import Search, { AlgoliaDocSearchRef } from './Search/Search'
import { BadgeWrapper } from './Shared/BadgeWrapper'

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            position: 'sticky',
            paddingTop: theme.spacing(3),
            '@media (max-width: 959px) and (orientation: landscape)': {
                position: 'static',
            },
            top: 'env(safe-area-inset-top)',
            zIndex: theme.zIndex.appBar + 1,
            minHeight: 'calc(20vh - 24px)',
        },
        searchPaper: {
            padding: theme.spacing(2),
            display: 'flex',
            position: 'relative',
            boxShadow: theme.shadows[2],
        },
        buttonPaper: {
            padding: theme.spacing(1),
            display: 'flex',
            justifyContent: 'space-evenly',
            boxShadow: theme.shadows[2],
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
    })
)

const Header = () => {
    const [drawer, setDrawer] = useState(false)
    const classes = useStyles()

    const { setGridLayout, gridLayout } = useGridContext()
    const { bookmarks } = useBookmarkContext()
    const { user, shoppingList } = useFirebaseAuthContext()
    const history = useHistory()

    const openDrawer = () => setDrawer(true)
    const closeDrawer = () => setDrawer(false)

    return (
        <>
            <header className={classes.header}>
                <Grid container spacing={3} justify="center" alignItems="center">
                    <Hidden smDown>
                        <Grid item>
                            <Paper className={classes.buttonPaper}>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Tooltip
                                            title={
                                                gridLayout === 'grid'
                                                    ? 'Listenansicht'
                                                    : 'Gridansicht'
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
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Lesezeichen">
                                            <IconButton
                                                onClick={() => history.push(PATHS.bookmarks)}>
                                                <BadgeWrapper badgeContent={bookmarks.size}>
                                                    <BookmarkMultipleOutline />
                                                </BadgeWrapper>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Einkaufsliste">
                                            <div>
                                                <IconButton
                                                    disabled={!user}
                                                    onClick={() =>
                                                        history.push(PATHS.shoppingList)
                                                    }>
                                                    <BadgeWrapper badgeContent={shoppingList.size}>
                                                        <ShoppingCartIcon />
                                                    </BadgeWrapper>
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={8} lg={6}>
                        <Paper className={classes.searchPaper}>
                            <Search />
                            <Hidden mdUp>
                                <IconButton onClick={openDrawer} size="small">
                                    <MenuIcon />
                                </IconButton>
                            </Hidden>
                        </Paper>
                    </Grid>
                    <Hidden smDown>
                        <Grid item>
                            <Paper className={classes.buttonPaper}>
                                <Tooltip title="Impressum">
                                    <IconButton onClick={() => history.push(PATHS.impressum)}>
                                        <InformationOutline />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </Grid>
                    </Hidden>
                </Grid>
            </header>

            <Hidden mdUp>
                <SwipeableDrawer
                    anchor="right"
                    open={drawer}
                    classes={{ paper: classes.drawerPaper }}
                    disableSwipeToOpen={false}
                    onOpen={openDrawer}
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
                        <ListItem button onClick={() => history.push(PATHS.bookmarks)}>
                            <ListItemIcon>
                                <BadgeWrapper badgeContent={bookmarks.size}>
                                    <BookmarkMultipleOutline />
                                </BadgeWrapper>
                            </ListItemIcon>
                            <ListItemText primary="Lesezeichen" />
                        </ListItem>
                        <ListItem
                            button
                            disabled={!user}
                            onClick={() => history.push(PATHS.shoppingList)}>
                            <ListItemIcon>
                                <BadgeWrapper badgeContent={shoppingList.size}>
                                    <ShoppingCartIcon />
                                </BadgeWrapper>
                            </ListItemIcon>
                            <ListItemText primary="Einkaufsliste" />
                        </ListItem>

                        <Divider className={classes.divider} />

                        <ListItem button onClick={() => history.push(PATHS.impressum)}>
                            <ListItemIcon>
                                <InformationOutline />
                            </ListItemIcon>
                            <ListItemText primary="Impressum" />
                        </ListItem>
                    </List>
                </SwipeableDrawer>
            </Hidden>
        </>
    )
}

export default Header
