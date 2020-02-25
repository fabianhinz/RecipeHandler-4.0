import { createStyles, makeStyles } from '@material-ui/core'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { ShoppingList, ShoppingTracker, User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import BuiltWithFirebase from '../Shared/BuiltWithFirebase'

interface AuthContext {
    user: User | undefined
    shoppingList: ShoppingList
    shoppingTracker: ShoppingTracker
    loginEnabled: boolean
}

const Context = React.createContext<AuthContext>({
    user: undefined,
    shoppingList: new Map(),
    shoppingTracker: new Map(),
    loginEnabled: false,
})

export const useFirebaseAuthContext = () => useContext(Context)

const useStyles = makeStyles(() =>
    createStyles({
        '@keyframes chip-appear': {
            from: {
                opacity: 0,
            },
            to: {
                opacity: 1,
            },
        },
        chip: {
            animation: `$chip-appear 0.25s ease-in`,
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
    })
)

const FirebaseAuthProvider: FC = ({ children }) => {
    const [authReady, setAuthReady] = useState(false)
    const [loginEnabled, setLoginEnabled] = useState(false)
    const [user, setUser] = useState<User | undefined>()
    const [shoppingList, setShoppingList] = useState<ShoppingList>(new Map())
    const [shoppingTracker, setShoppingTracker] = useState<ShoppingTracker>(new Map())

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

        const userDocUnsubscribe = userDocRef.onSnapshot(doc => {
            setUser({
                ...(doc.data() as Omit<User, 'uid'>),
                uid: user.uid,
            })
            setLoginEnabled(true)
        })

        const shoppingListUnsubscribe = userDocRef
            .collection('shoppingList')
            .onSnapshot(querySnapshot => {
                const newShoppingList: ShoppingList = new Map()
                const newShoppingTracker: ShoppingTracker = new Map()

                querySnapshot.docs.forEach(doc => {
                    const { list, tracker } = doc.data() as {
                        list: string[]
                        tracker: string[]
                    }
                    newShoppingList.set(doc.id, {
                        // ? creating the recipe "Sonstiges" will create an item with a lenght of zero
                        list: list.filter(item => item.length > 0),
                    })
                    newShoppingTracker.set(doc.id, { tracker })
                })

                setShoppingList(newShoppingList)
                setShoppingTracker(newShoppingTracker)
            })

        return () => {
            userDocUnsubscribe()
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
        <Context.Provider value={{ user, shoppingList, shoppingTracker, loginEnabled }}>
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
