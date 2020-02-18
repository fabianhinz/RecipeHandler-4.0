import {
    createStyles,
    Grid,
    Hidden,
    IconButton,
    makeStyles,
    Paper,
    SwipeableDrawer,
    Tooltip,
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
            position: 'sticky',
            paddingTop: theme.spacing(3),
            '@media (max-width: 1023px) and (orientation: landscape)': {
                position: 'static',
            },
            top: 'env(safe-area-inset-top)',
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
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
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
                <Tooltip title={gridLayout === 'grid' ? 'Listenansicht' : 'Gridansicht'}>
                    <IconButton
                        onClick={() => setGridLayout(prev => (prev === 'grid' ? 'list' : 'grid'))}>
                        {gridLayout === 'grid' ? <ViewAgendaOutline /> : <ViewGridOutline />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Lesezeichen">
                    <IconButton onClick={() => history.push(PATHS.bookmarks)}>
                        <BadgeWrapper badgeContent={bookmarks.size}>
                            <BookmarkMultipleOutline />
                        </BadgeWrapper>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Impressum">
                    <IconButton onClick={() => history.push(PATHS.impressum)}>
                        <InformationOutline />
                    </IconButton>
                </Tooltip>
            </>
        ),
        [bookmarks.size, gridLayout, history, setGridLayout]
    )

    return (
        <header>
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
        </header>
    )
}

export default Header
