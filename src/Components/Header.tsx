import { createStyles, Grid, IconButton, makeStyles, Paper } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import GridIcon from '@material-ui/icons/ViewModule'
import React from 'react'

import Search from './Search/Search'

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            paddingTop: theme.spacing(4),
            position: 'sticky',
            top: 'env(safe-area-inset-bottom)',
            zIndex: theme.zIndex.appBar,
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

    return (
        <div className={classes.header}>
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12} sm={8} lg={6}>
                    <Paper className={classes.searchPaper}>
                        <Search />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <Paper className={classes.buttonPaper}>
                        <IconButton onClick={() => alert('todo')}>
                            <GridIcon />
                        </IconButton>
                        <IconButton onClick={() => alert('todo')}>
                            <InfoIcon />
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Header
