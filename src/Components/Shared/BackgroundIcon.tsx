import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        iconContainer: {
            zIndex: -1,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '40vh',
            padding: theme.spacing(3),
            backgroundColor: theme.palette.primary.main,
        },
        icon: {
            opacity: 0.9,
            filter: 'brightness(90%)',
            [theme.breakpoints.between('xs', 'lg')]: {
                display: 'none',
            },
            [theme.breakpoints.up('xl')]: {
                height: '100%',
            },
        },
    })
)

interface BackgroundIconProps {
    Icon: FC<React.SVGProps<SVGSVGElement>>
}

export const BackgroundIcon: FC<BackgroundIconProps> = ({ Icon }) => {
    const classes = useStyles()

    return (
        <div className={classes.iconContainer}>
            <Icon className={classes.icon} />
        </div>
    )
}
