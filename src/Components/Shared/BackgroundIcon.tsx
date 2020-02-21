import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        '@keyframes background-icon-appear': {
            from: {
                opacity: 0,
            },
            to: {
                opacity: theme.palette.type === 'dark' ? 0.2 : 0.4,
            },
        },
        icon: {
            animation: `$background-icon-appear 0.5s ease-in`,
            zIndex: -1,
            opacity: theme.palette.type === 'dark' ? 0.2 : 0.4,
            position: 'fixed',
            bottom: theme.spacing(12),
            right: '30%',
            left: '30%',
            [theme.breakpoints.only('xs')]: {
                display: 'none',
            },
            [theme.breakpoints.up('sm')]: {
                width: '40%',
            },
        },
    })
)

interface BackgroundIconProps {
    Icon: FC<React.SVGProps<SVGSVGElement>>
}

export const BackgroundIcon: FC<BackgroundIconProps> = ({ Icon }) => {
    const classes = useStyles()

    return <Icon className={classes.icon} />
}
