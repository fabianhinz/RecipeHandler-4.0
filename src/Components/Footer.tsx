import { AppBar, createStyles, makeStyles } from '@material-ui/core'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FolderIcon from '@material-ui/icons/Folder'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import RestoreIcon from '@material-ui/icons/Restore'
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
            {/* <BottomNavigation value="recents">
                <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
                <BottomNavigationAction
                    label="Favorites"
                    value="favorites"
                    icon={<FavoriteIcon />}
                />
                <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
                <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
            </BottomNavigation> */}
            {/* <AppBar className={classes.appbar} color="default">
                <Navigation />
            </AppBar>
            <div className={classes.safeAreaIos} /> */}
        </footer>
    )
}

export default Footer
