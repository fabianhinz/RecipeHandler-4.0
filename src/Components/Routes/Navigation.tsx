import { Button, createStyles, Hidden, IconButton, makeStyles } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import HomeIcon from '@material-ui/icons/HomeRounded'
import { Lightbulb } from 'mdi-material-ui'
import React, { memo, useState } from 'react'

import AccountAuthentication from '../Account/AccountAuthentication'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { BadgeWrapper } from '../Shared/BadgeWrapper'
import { Navigate } from './Navigate'
import { PATHS } from './Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            [theme.breakpoints.down('sm')]: {
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
            },
        },
    })
)

const Navigation = () => {
    const [authenticationOpen, setAuthenticationOpen] = useState(false)

    const { user, loginEnabled, shoppingList } = useFirebaseAuthContext()

    const classes = useStyles()

    return (
        <>
            <div className={classes.container}>
                <Hidden xsDown>
                    <Navigate to={PATHS.home}>
                        <Button size="large" startIcon={<HomeIcon />}>
                            Start
                        </Button>
                    </Navigate>

                    <Navigate to={PATHS.trials}>
                        <Button size="large" startIcon={<Lightbulb />}>
                            Ideen
                        </Button>
                    </Navigate>

                    <Navigate disabled={!user} to={PATHS.account}>
                        <Button
                            disabled={!loginEnabled}
                            onClick={() => {
                                if (!user) setAuthenticationOpen(true)
                            }}
                            size="large"
                            startIcon={
                                <BadgeWrapper badgeContent={shoppingList.size}>
                                    <AccountIcon />
                                </BadgeWrapper>
                            }>
                            {!user ? 'Einloggen' : 'Account'}
                        </Button>
                    </Navigate>
                </Hidden>

                <Hidden smUp>
                    <Navigate to={PATHS.home} activeStyle="rounded">
                        <IconButton>
                            <HomeIcon />
                        </IconButton>
                    </Navigate>

                    <Navigate to={PATHS.trials} activeStyle="rounded">
                        <IconButton>
                            <Lightbulb />
                        </IconButton>
                    </Navigate>

                    <Navigate disabled={!user} to={PATHS.account} activeStyle="rounded">
                        <IconButton
                            disabled={!loginEnabled}
                            onClick={() => {
                                if (!user) setAuthenticationOpen(true)
                            }}>
                            <BadgeWrapper badgeContent={shoppingList.size}>
                                <AccountIcon />
                            </BadgeWrapper>
                        </IconButton>
                    </Navigate>
                </Hidden>
            </div>

            <AccountAuthentication
                open={authenticationOpen}
                onClose={() => setAuthenticationOpen(false)}
            />
        </>
    )
}

export default memo(Navigation)
