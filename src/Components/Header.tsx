import {
    createStyles,
    Grid,
    Hidden,
    IconButton,
    makeStyles,
    Paper,
    SwipeableDrawer,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import {
    BookmarkMultipleOutline,
    InformationOutline,
    ViewAgendaOutline,
    ViewGridOutline,
} from 'mdi-material-ui'
import React, { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useBookmarkContext } from './Provider/BookmarkProvider'
import { useGridContext } from './Provider/GridProvider'
import { PATHS } from './Routes/Routes'
import Search, { AlgoliaDocSearchRef } from './Search/Search'
import { BadgeWrapper } from './Shared/BadgeWrapper'

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            paddingTop: theme.spacing(4),
            position: 'sticky',
            '@media (max-width: 1023px) and (orientation: landscape)': {
                position: 'static',
            },
            top: 'env(safe-area-inset-bottom)',
            zIndex: theme.zIndex.appBar + 1,
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
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
        },
        drawerActions: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
)

const Header = () => {
    const [drawer, setDrawer] = useState(false)
    const classes = useStyles()

    const { setGridLayout, gridLayout } = useGridContext()
    const { bookmarks } = useBookmarkContext()
    const history = useHistory()

    const openDrawer = () => setDrawer(true)
    const closeDrawer = () => setDrawer(false)

    const actions = useMemo(
        () => (
            <>
                <IconButton
                    onClick={() => setGridLayout(prev => (prev === 'grid' ? 'list' : 'grid'))}>
                    {gridLayout === 'grid' ? <ViewAgendaOutline /> : <ViewGridOutline />}
                </IconButton>
                <IconButton onClick={() => history.push(PATHS.bookmarks)}>
                    <BadgeWrapper badgeContent={bookmarks.size}>
                        <BookmarkMultipleOutline />
                    </BadgeWrapper>
                </IconButton>
                <IconButton onClick={() => alert('todo')}>
                    <InformationOutline />
                </IconButton>
            </>
        ),
        [bookmarks.size, gridLayout, history, setGridLayout]
    )

    return (
        <>
            <div className={classes.header}>
                <Grid container spacing={3} justify="center" alignItems="center">
                    <Grid item xs={12} sm={8} lg={6}>
                        <Paper className={classes.searchPaper}>
                            <Search />
                            <Hidden smUp>
                                <IconButton onClick={openDrawer} size="small">
                                    <BadgeWrapper badgeContent={bookmarks.size}>
                                        <MenuIcon />
                                    </BadgeWrapper>
                                </IconButton>
                            </Hidden>
                        </Paper>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item>
                            <Paper className={classes.buttonPaper}>{actions}</Paper>
                        </Grid>
                    </Hidden>
                </Grid>
            </div>

            <Hidden smUp>
                <SwipeableDrawer
                    anchor="right"
                    open={drawer}
                    classes={{ paper: classes.drawerPaper }}
                    onOpen={openDrawer}
                    onClose={closeDrawer}>
                    <div onClick={closeDrawer} className={classes.drawerActions}>
                        {actions}
                    </div>
                    {AlgoliaDocSearchRef}
                </SwipeableDrawer>
            </Hidden>
        </>
    )
}

export default Header
