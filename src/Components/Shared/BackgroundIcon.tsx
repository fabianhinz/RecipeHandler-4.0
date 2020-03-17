import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { ReactComponent as Background } from '../../icons/details.svg'

const useStyles = makeStyles(theme =>
    createStyles({
        iconContainer: {
            zIndex: -1,
            position: 'fixed',
            top: 64,
            left: 0,
            [theme.breakpoints.up('md')]: {
                left: 95,
            },
            width: '100vw',
            height: '40vh',
            backgroundImage: `linear-gradient(90deg,${
                theme.palette.type === 'light' ? '#8EDB91' : '#74B377'
            } 30%,#81c784 70%)`,
            padding: theme.spacing(1),
        },
        icon: {
            opacity: 0.9,
            padding: theme.spacing(3),
            filter: theme.palette.type === 'light' ? 'brightness(110%)' : 'brightness(90%)',
            [theme.breakpoints.between('xs', 'sm')]: {
                height: '0%',
            },
            [theme.breakpoints.up('md')]: {
                height: '100%',
            },
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
