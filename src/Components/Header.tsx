import { createStyles, Grid, Hidden, IconButton, makeStyles, Paper } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import GridIcon from '@material-ui/icons/ViewModule'
import ListIcon from '@material-ui/icons/ViewStream'
import React from 'react'

import { useGridContext } from './Provider/GridProvider'
import Search from './Search/Search'

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            paddingTop: theme.spacing(4),
            position: 'sticky',
            top: 'env(safe-area-inset-bottom)',
            zIndex: theme.zIndex.modal + 1,
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

    return (
        <div className={classes.header}>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12} sm={8} lg={6}>
                    <Paper className={classes.searchPaper}>
                        <Search />
                    </Paper>
                </Grid>
                <Hidden xsDown>
                    <Grid item xs={12} sm={4} md={2}>
                        <Paper className={classes.buttonPaper}>
                            <IconButton
                                onClick={() =>
                                    setGridLayout(prev => (prev === 'grid' ? 'list' : 'grid'))
                                }>
                                {gridLayout === 'grid' ? <GridIcon /> : <ListIcon />}
                            </IconButton>
                            <IconButton size="small" onClick={() => alert('todo')}>
                                <InfoIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    )
}

export default Header
