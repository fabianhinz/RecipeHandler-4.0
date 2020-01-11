import { createStyles, Fab, makeStyles, Zoom } from '@material-ui/core'
import React, { CSSProperties, FC } from 'react'
import { Link } from 'react-router-dom'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

const style: CSSProperties = { textDecoration: 'none', color: 'inherit' }

interface NavigateProps {
    to: string
}

export const Navigate: FC<NavigateProps> = ({ to, children }) => (
    <Link to={to} style={style}>
        {children}
    </Link>
)

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(4.5)}px)`,
        },
    })
)

interface NavigateFabProps {
    to: string
    icon: JSX.Element
}

export const NavigateFab = ({ to, icon }: NavigateFabProps) => {
    const classes = useStyles()
    const { user } = useFirebaseAuthContext()

    return (
        <>
            {user && (
                <Navigate to={to}>
                    <Zoom in>
                        <Fab className={classes.fab} color="secondary">
                            {icon}
                        </Fab>
                    </Zoom>
                </Navigate>
            )}
        </>
    )
}
