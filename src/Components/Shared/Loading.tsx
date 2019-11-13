import { Box, CircularProgress, createStyles, LinearProgress, makeStyles } from '@material-ui/core'
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

interface Props {
    variant: 'linear' | 'circular'
}

export const Loading = ({ variant }: Props) => {
    const classes = useStyles()

    return (
        <Box
            height="100%"
            minHeight={50}
            display="flex"
            justifyContent="center"
            alignItems="center">
            {variant === 'linear' ? (
                <LinearProgress className={classes.progress} color="primary" variant="query" />
            ) : (
                <CircularProgress disableShrink size={50} thickness={4} />
            )}
        </Box>
    )
}
