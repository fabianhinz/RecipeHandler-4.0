import { createStyles, Fab, makeStyles, Tooltip, Zoom } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            [theme.breakpoints.down('md')]: {
                right: theme.spacing(2),
                bottom: `max(env(safe-area-inset-bottom), ${theme.spacing(2)}px)`,
            },
            [theme.breakpoints.up('lg')]: {
                right: theme.spacing(4),
                bottom: theme.spacing(4),
            },
        },
    })
)

interface Props {
    icon: JSX.Element
    tooltipTitle: React.ReactNode
    onClick?: () => void
    pathname?: string
}

export const SecouredRouteFab = ({ icon, tooltipTitle, onClick, pathname }: Props) => {
    const classes = useStyles({})
    const history = useHistory()
    const { user } = useFirebaseAuthContext()

    const handleClick = () => {
        if (onClick) onClick()
        if (pathname) history.push(pathname)
    }

    return (
        <>
            {user && (
                <Zoom in>
                    <Tooltip title={tooltipTitle} placement="left">
                        <Fab onClick={handleClick} className={classes.fab} color="secondary">
                            {icon}
                        </Fab>
                    </Tooltip>
                </Zoom>
            )}
        </>
    )
}
