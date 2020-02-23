import { CircularProgress, createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        linearProgress: {
            position: 'fixed',
            bottom: `calc(0px + env(safe-area-inset-bottom))`,
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
    })
)

export type ProgressVariant = 'fixed' | 'cover'

interface Props {
    variant: ProgressVariant
}

const Progress = ({ variant }: Props) => {
    const classes = useStyles()

    if (variant === 'cover')
        return (
            <div className={classes.circularProgress}>
                <CircularProgress color="secondary" disableShrink size={60} thickness={5.4} />
            </div>
        )

    if (variant === 'fixed') return <LinearProgress className={classes.linearProgress} />

    return <></>
}

export default Progress
