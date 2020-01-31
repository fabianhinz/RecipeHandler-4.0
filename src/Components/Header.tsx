import { AppBar, Grid, IconButton, Toolbar, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import React from 'react'

import { ReactComponent as Logo } from '../icons/logo.svg'
import Search from './Search/Search'

const Header = () => (
    <AppBar position="sticky" color="default">
        <Toolbar>
            <Grid container spacing={2} justify="space-between" alignItems="center">
                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Logo height={40} />
                        </Grid>
                        <Grid item>
                            <Typography
                                style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                                display="inline"
                                variant="h4">
                                Recipe Handler
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Search />
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => alert('todo')}>
                                <InfoIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Toolbar>
    </AppBar>
)

export default Header
