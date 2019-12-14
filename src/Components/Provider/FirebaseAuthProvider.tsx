import { Avatar, CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { ReactComponent as FirebaseIcon } from '../../icons/firebase.svg'
import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

const Context = React.createContext<{ user: User | null }>({ user: null })

export const useFirebaseAuthContext = () => useContext(Context)

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            position: 'relative',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#2C384A',
            padding: theme.spacing(4),
            width: theme.spacing(8),
            height: theme.spacing(8),
            boxShadow: theme.shadows[8],
        },
        progress: {
            position: 'absolute',
            color: '#ffcd34',
        },
    })
)

let userDocUnsubscribe: any = undefined
// ToDo implement a nice loading auth animation
const FirebaseAuthProvider: FC = ({ children }) => {
    const [authReady, setAuthReady] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    const classes = useStyles()

    const handleAuthStateChange = useCallback((user: firebase.User | null) => {
        if (user) {
            setAuthReady(true)
            if (user.isAnonymous) {
                setUser(null)
                return
            }
            // only registered users have a additional props
            userDocUnsubscribe = FirebaseService.firestore
                .collection('users')
                .doc(user.uid)
                .onSnapshot(doc =>
                    setUser({
                        ...(doc.data() as Omit<User, 'uid'>),
                        uid: user.uid,
                    })
                )
        } else FirebaseService.auth.signInAnonymously()
    }, [])

    useEffect(() => {
        return userDocUnsubscribe
    }, [])

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(handleAuthStateChange)
    }, [handleAuthStateChange])

    return (
        <Context.Provider value={{ user }}>
            {authReady ? (
                children
            ) : (
                <Avatar className={classes.avatar}>
                    <FirebaseIcon height="100%" />
                    <CircularProgress size={130} className={classes.progress} />
                </Avatar>
            )}
        </Context.Provider>
    )
}

export default FirebaseAuthProvider
