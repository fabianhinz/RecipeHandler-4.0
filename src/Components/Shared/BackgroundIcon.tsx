import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { ReactComponent as Background } from '../../icons/background.svg'

const useStyles = makeStyles(theme =>
    createStyles({
        iconContainer: {
            zIndex: -1,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '40vh',
            backgroundImage: 'linear-gradient(90deg, #74B276 30%,#81c784 70%)',
            padding: theme.spacing(1),
        },
        icon: {
            opacity: 0.9,
            filter: 'brightness(90%)',
            height: '100%',
        },
    })
)

export const BackgroundIcon = () => {
    const classes = useStyles()

    return (
        <div className={classes.iconContainer}>
            <Background className={classes.icon} />
        </div>
    )
}
