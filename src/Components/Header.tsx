import { createStyles, Grid, Hidden, IconButton, makeStyles, Paper } from '@material-ui/core'
import {
    BookmarkMultipleOutline,
    InformationOutline,
    ViewAgendaOutline,
    ViewGridOutline,
} from 'mdi-material-ui'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { useBookmarkContext } from './Provider/BookmarkProvider'
import { useGridContext } from './Provider/GridProvider'
import { PATHS } from './Routes/Routes'
import Search from './Search/Search'
import { BadgeWrapper } from './Shared/BadgeWrapper'

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            paddingTop: theme.spacing(4),
            position: 'sticky',
            top: 'env(safe-area-inset-bottom)',
            zIndex: theme.zIndex.appBar + 1,
        },
        searchPaper: {
            padding: 16,
            display: 'flex',
            position: 'relative',
            boxShadow: theme.shadows[2],
        },
        buttonPaper: {
            padding: 8,
            display: 'flex',
            justifyContent: 'space-evenly',
            boxShadow: theme.shadows[2],
        },
    })
)

const Header = () => {
    const classes = useStyles()

    const { setGridLayout, gridLayout } = useGridContext()
    const { bookmarks } = useBookmarkContext()
    const history = useHistory()

    return (
        <div className={classes.header}>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12} sm={8} lg={6}>
                    <Paper className={classes.searchPaper}>
                        <Search />
                    </Paper>
                </Grid>
                <Hidden xsDown>
                    <Grid item>
                        <Paper className={classes.buttonPaper}>
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
                            <IconButton onClick={() => history.push(PATHS.bookmarks)}>
                                <BadgeWrapper badgeContent={bookmarks.size}>
                                    <BookmarkMultipleOutline />
                                </BadgeWrapper>
                            </IconButton>
                            <IconButton onClick={() => alert('todo')}>
                                <InformationOutline />
                            </IconButton>
                        </Paper>
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    )
}

export default Header
