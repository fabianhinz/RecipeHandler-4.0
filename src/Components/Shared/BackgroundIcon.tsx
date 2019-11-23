import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        backgroundContainer: {
            position: 'fixed',
            right: theme.spacing(3),
            left: theme.spacing(3),
            bottom: theme.spacing(12),
            zIndex: -1,
        },
        icon: {
            opacity: 0.8,
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
            [theme.breakpoints.only('md')]: {
                width: 300,
            },
            [theme.breakpoints.only('lg')]: {
                width: 400,
            },
            [theme.breakpoints.up('xl')]: {
                width: 500,
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
        <div className={classes.backgroundContainer}>
            <Icon className={classes.icon} />
        </div>
    )
}
