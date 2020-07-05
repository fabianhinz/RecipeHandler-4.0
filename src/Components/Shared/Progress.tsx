import { CircularProgress, LinearProgress, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../../theme'

const useStyles = makeStyles(theme => ({
    linearProgress: {
        position: 'fixed',
        top: `max(0px, env(safe-area-inset-bottom))`,
        left: 0,
        width: '100vw',
        zIndex: theme.zIndex.appBar + 1,
    },
    circularProgress: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS,
        zIndex: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
}))

export type ProgressVariant = 'fixed' | 'absolute'

interface Props {
    variant: ProgressVariant
}

const Progress = ({ variant }: Props) => {
    const classes = useStyles()

    if (variant === 'absolute')
        return (
            <div className={classes.circularProgress}>
                <CircularProgress color="secondary" disableShrink size={60} thickness={5.4} />
            </div>
        )

    if (variant === 'fixed')
        return <LinearProgress variant="query" className={classes.linearProgress} />

    return <></>
}

export default Progress
