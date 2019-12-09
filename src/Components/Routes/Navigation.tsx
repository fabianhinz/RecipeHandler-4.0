import {
    Button,
    createStyles,
    Hidden,
    IconButton,
    makeStyles,
    useMediaQuery,
} from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import HomeIcon from '@material-ui/icons/HomeRounded'
import clsx from 'clsx'
import { Lightbulb } from 'mdi-material-ui'
import React, { memo } from 'react'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { PINNED_WIDTH, usePinnedRecipesContext } from '../Provider/PinnedRecipesProvider'
import { Navigate } from './Navigate'
import { PATHS } from './Routes'

interface Props {
    onOpenTrialsDialog: () => void
    onOpenUserDialog: () => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        },
        mobilePadding: {
            paddingRight: theme.spacing(5),
        },
        pinnedRecipes: {
            marginLeft: PINNED_WIDTH,
        },
    })
)

const Navigation = ({ onOpenTrialsDialog, onOpenUserDialog }: Props) => {
    const { user } = useFirebaseAuthContext()
    const { pinnedOnDesktop } = usePinnedRecipesContext()

    const isMobilePadding = useMediaQuery('(max-width: 425px)')

    const classes = useStyles()

    return (
        <div
            className={clsx(
                classes.container,
                pinnedOnDesktop && classes.pinnedRecipes,
                isMobilePadding && user && classes.mobilePadding
            )}>
            <Hidden xsDown>
                <Navigate to={PATHS.home}>
                    <Button size="large" startIcon={<HomeIcon />}>
                        Start
                    </Button>
                </Navigate>

                <Button size="large" startIcon={<Lightbulb />} onClick={onOpenTrialsDialog}>
                    Ideen
                </Button>

                <Button size="large" startIcon={<AccountIcon />} onClick={onOpenUserDialog}>
                    {!user ? 'Einloggen' : 'Account'}
                </Button>
            </Hidden>

            <Hidden smUp>
                <Navigate to={PATHS.home}>
                    <IconButton>
                        <HomeIcon />
                    </IconButton>
                </Navigate>
                <IconButton onClick={onOpenTrialsDialog}>
                    <Lightbulb />
                </IconButton>
                <IconButton onClick={onOpenUserDialog}>
                    <AccountIcon />
                </IconButton>
            </Hidden>
        </div>
    )
}

export default memo(Navigation)
