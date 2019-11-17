import { createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(() =>
    createStyles({
        progress: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
        },
    })
)

export const Loading = () => {
    const classes = useStyles()
    return <LinearProgress className={classes.progress} />
}
