import { Avatar, CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { ReactComponent as FirebaseIcon } from '../../icons/firebase.svg'
import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

const Context = React.createContext<{ user: User | null; loginEnabled: boolean }>({
    user: null,
    loginEnabled: false,
})

export const useFirebaseAuthContext = () => useContext(Context)

const useStyles = makeStyles(theme =>
    createStyles({
        auth: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
        },
        avatar: {
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
        main: {
            paddingTop: 'env(safe-area-inset-top)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            paddingBottom: 'env(safe-area-inset-bottom)',
        },
    })
)

let userDocUnsubscribe: any = undefined

const FirebaseAuthProvider: FC = ({ children }) => {
    const [authReady, setAuthReady] = useState(false)
    const [loginEnabled, setLoginEnabled] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    const classes = useStyles()

    const handleAuthStateChange = useCallback(async (user: firebase.User | null) => {
        if (user) {
            setAuthReady(true)
            if (user.isAnonymous) {
                setUser(null)
                setLoginEnabled(true)
                FirebaseService.analytics.setUserId(`Anonymous - ${user.uid}`)
            } else {
                const userDocRef = FirebaseService.firestore.collection('users').doc(user.uid)
                await userDocRef.update({ emailVerified: user.emailVerified })

                FirebaseService.analytics.setUserId(user.uid)

                userDocUnsubscribe = userDocRef.onSnapshot(doc => {
                    setUser({
                        ...(doc.data() as Omit<User, 'uid'>),
                        uid: user.uid,
                    })
                    setLoginEnabled(true)
                })
            }
        } else FirebaseService.auth.signInAnonymously()
    }, [])

    const signInWithCustomToken = useCallback(async () => {
        if (!user) return
        const getCustomToken = FirebaseService.functions.httpsCallable('getCustomToken')
        try {
            const response = await getCustomToken(user.uid)
            FirebaseService.auth.signInWithCustomToken(response.data)
        } catch (e) {
            // only editors may recive a custom token, catch and move on for other users
        }
    }, [user])

    useEffect(() => {
        signInWithCustomToken()
    }, [signInWithCustomToken])

    useEffect(() => {
        return userDocUnsubscribe
    }, [])

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(handleAuthStateChange)
    }, [handleAuthStateChange])

    return (
        <Context.Provider value={{ user, loginEnabled }}>
            {authReady ? (
                <div className={classes.main}>{children}</div>
            ) : (
                <div className={classes.auth}>
                    <Avatar className={classes.avatar}>
                        <FirebaseIcon height="100%" />
                        <CircularProgress size={130} className={classes.progress} />
                    </Avatar>
                </div>
            )}
        </Context.Provider>
    )
}

export default FirebaseAuthProvider
