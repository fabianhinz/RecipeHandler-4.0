import { CircularProgress, createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import React from 'react'

import { BORDER_RADIUS } from '../../theme'

const useStyles = makeStyles(() =>
    createStyles({
        linearProgress: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100vw',
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

interface Props {
    variant: 'fixed' | 'cover'
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
