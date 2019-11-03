import { Box, createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS, BORDER_RADIUS_HUGE } from '../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            borderRadius: BORDER_RADIUS,
            width: '100%',
        },
        progress: {
            flexGrow: 1,
            borderRadius: BORDER_RADIUS_HUGE,
            height: theme.spacing(1),
        },
    })
)

export const Loading = () => {
    const classes = useStyles()

    return (
        <Box
            height="100%"
            minHeight={50}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <LinearProgress className={classes.progress} color="primary" variant="query" />
        </Box>
    )
}
