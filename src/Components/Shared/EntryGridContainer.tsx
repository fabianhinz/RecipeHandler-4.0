import { createStyles, Grid, makeStyles } from '@material-ui/core'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            overflowX: 'hidden',
        },
    })
)

const EntryGridContainer = ({ children }: Props) => {
    const classes = useStyles()

    return (
        <Grid container className={classes.container} spacing={4} justify="space-between">
            {children}
        </Grid>
    )
}

export default EntryGridContainer
