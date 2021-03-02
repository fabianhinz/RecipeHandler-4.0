import { makeStyles } from '@material-ui/core'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import BuiltWithFirebase from '../Shared/BuiltWithFirebase'

interface AuthContext {
    user: User | undefined
    activeItemsInShoppingList: number
    loginEnabled: boolean
}

const Context = React.createContext<AuthContext>({
    user: undefined,
    activeItemsInShoppingList: 0,
    loginEnabled: false,
})

export const useFirebaseAuthContext = () => useContext(Context)

const useStyles = makeStyles(() => ({
    '@keyframes chip-appear': {
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
        },
    },
    chip: {
        animation: `$chip-appear 0.225s ease-out`,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
    },
    main: {
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
    },
}))

const FirebaseAuthProvider: FC = ({ children }) => {
    const [authReady, setAuthReady] = useState(false)
    const [loginEnabled, setLoginEnabled] = useState(false)
    const [user, setUser] = useState<User | undefined>()
    const [activeItemsInShoppingList, setActiveItemsInShoppingList] = useState(0)

    const classes = useStyles()

    const handleAuthStateChange = useCallback((user: firebase.User | null) => {
        if (!user) return FirebaseService.auth.signInAnonymously()

        setAuthReady(true)
        if (user.isAnonymous) {
            setUser(undefined)
            setLoginEnabled(true)
            return
        }

        const userDocRef = FirebaseService.firestore.collection('users').doc(user.uid)

        const userDocUnsubsribe = userDocRef.onSnapshot(doc => {
            setUser({
                ...(doc.data() as Omit<User, 'uid'>),
                uid: user.uid,
            })
            setLoginEnabled(true)
        })

        const shoppingListUnsubscribe = userDocRef
            .collection('shoppingList')
            .where('checked', '==', false)
            .onSnapshot(snapshot => setActiveItemsInShoppingList(snapshot.docs.length))

        return () => {
            userDocUnsubsribe()
            shoppingListUnsubscribe()
        }
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
        if (!user || user.emailVerified) return

        FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .update({ emailVerified: user.emailVerified })
    }, [user])

    useEffect(() => {
        signInWithCustomToken()
    }, [signInWithCustomToken])

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(handleAuthStateChange)
    }, [handleAuthStateChange])

    return (
        <Context.Provider value={{ user, loginEnabled, activeItemsInShoppingList }}>
            {authReady ? (
                <div className={classes.main}>{children}</div>
            ) : (
                <div className={classes.chip}>
                    <BuiltWithFirebase loading />
                </div>
            )}
        </Context.Provider>
    )
}

export default FirebaseAuthProvider
