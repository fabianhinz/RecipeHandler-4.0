import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        icon: {
            zIndex: -1,
            opacity: theme.palette.type === 'dark' ? 0.2 : 0.4,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            [theme.breakpoints.between('xs', 'sm')]: {
                display: 'none',
            },
            [theme.breakpoints.between('md', 'lg')]: {
                width: '40%',
            },
            [theme.breakpoints.up('xl')]: {
                width: '30%',
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
