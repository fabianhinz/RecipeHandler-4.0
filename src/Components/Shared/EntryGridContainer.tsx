import { createStyles, Fade, Grid, makeStyles } from '@material-ui/core'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            overflowX: 'hidden',
        },
    })
)

const EntryGridContainer = ({ children }: Props) => {
    const classes = useStyles()

    return (
        <Fade in unmountOnExit>
            <Grid container className={classes.container} spacing={4} justify="space-between">
                {children}
            </Grid>
        </Fade>
    )
}

export default EntryGridContainer
