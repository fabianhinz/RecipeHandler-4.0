import { makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    iconContainer: {
        zIndex: -1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '40vh',
        backgroundImage: `linear-gradient(90deg,${
            theme.palette.type === 'light' ? '#8EDB91' : '#74B377'
        } 30%,#81c784 70%)`,
        padding: theme.spacing(1),
        [theme.breakpoints.between('xs', 'sm')]: {
            display: 'none',
        },
        [theme.breakpoints.up('md')]: {
            left: 95,
        },
    },
    icon: {
        marginTop: 64,
        padding: theme.spacing(3),
        filter: theme.palette.type === 'light' ? 'brightness(110%)' : 'brightness(90%)',
        height: '110%',
    },
}))

interface Props {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const Background = ({ Icon }: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.iconContainer}>
            <Icon className={classes.icon} />
        </div>
    )
}
