import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

import Container from './Container'

const useStyles = makeStyles(theme =>
    createStyles({
        backgroundContainer: {
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
        },
        iconBackground: {
            opacity: 0.3,
            [theme.breakpoints.down('sm')]: {
                width: 0,
            },
            [theme.breakpoints.between('md', 'lg')]: {
                width: '50%',
            },
            [theme.breakpoints.up('xl')]: {
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

    return (
        <Container className={classes.backgroundContainer}>
            <Icon className={classes.iconBackground} />
        </Container>
    )
}
