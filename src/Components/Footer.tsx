import { AppBar, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { useFirebaseAuthContext } from './Provider/FirebaseAuthProvider'
import Navigation from './Routes/Navigation'

interface StyleProps {
    isBlackTheme: boolean
}

const useStyles = makeStyles(theme => {
    const getBackgroundColor = ({ isBlackTheme }: StyleProps) => {
        return theme.palette.type === 'dark' ? (isBlackTheme ? '#1B1B1D' : '#212121') : '#f5f5f5'
    }

    return createStyles({
        appbar: {
            position: 'fixed',
            top: 'auto',
            bottom: 'env(safe-area-inset-bottom)',
            height: theme.spacing(8),
            backgroundColor: getBackgroundColor,
        },
        safeAreaIos: {
            zIndex: theme.zIndex.appBar,
            position: 'fixed',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'env(safe-area-inset-bottom)',
            backgroundColor: getBackgroundColor,
        },
    })
})

const Footer = () => {
    const { user } = useFirebaseAuthContext()
    const classes = useStyles({ isBlackTheme: Boolean(user?.muiTheme === 'black') })

    return (
        <footer>
            <AppBar className={classes.appbar} color="default">
                <Navigation />
            </AppBar>
            <div className={classes.safeAreaIos} />
        </footer>
    )
}

export default Footer
