import { ButtonProps, createStyles, Fab, makeStyles, Tooltip, Zoom } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { BORDER_RADIUS } from '../../theme'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { PATHS } from './Routes'

interface ActiveStyle {
    activeStyle?: 'square' | 'rounded'
}
interface NavigateProps extends ActiveStyle {
    to?: string
    disabled?: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: 'inherit',
        },
        linkActive: {
            backgroundColor:
                theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            borderRadius: ({ activeStyle }: ActiveStyle) =>
                activeStyle === 'rounded' ? '50%' : BORDER_RADIUS,
        },
        fab: {
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(4),
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(4)}px)`,
        },
    })
)

export const Navigate: FC<NavigateProps> = ({ to, children, disabled, activeStyle }) => {
    const { location } = useRouterContext()
    const classes = useStyles({ activeStyle })

    if (disabled || !to) return <>{children}</>
    else
        return (
            <Link
                to={to}
                className={clsx(
                    classes.link,
                    location.pathname === to &&
                        Object.entries(PATHS).some(([_key, path]) => path === location.pathname) &&
                        classes.linkActive
                )}>
                {children}
            </Link>
        )
}

interface NavigateFabProps extends NavigateProps, Pick<ButtonProps, 'onClick'> {
    icon: JSX.Element
    tooltipTitle: React.ReactNode
}

export const NavigateFab = ({ to, icon, onClick, tooltipTitle }: NavigateFabProps) => {
    const classes = useStyles({})
    const { user } = useFirebaseAuthContext()

    return (
        <>
            {user && (
                <Navigate to={to}>
                    <Zoom in>
                        <Tooltip title={tooltipTitle} placement="left">
                            <Fab onClick={onClick} className={classes.fab} color="secondary">
                                {icon}
                            </Fab>
                        </Tooltip>
                    </Zoom>
                </Navigate>
            )}
        </>
    )
}
