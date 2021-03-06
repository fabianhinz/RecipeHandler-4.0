import { makeStyles } from '@material-ui/core'
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { ShoppingListItem, User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { ArrayFns, ReorderParams } from '../../util/fns'
import BuiltWithFirebase from '../Shared/BuiltWithFirebase'

type DocumentRef = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

interface AuthContext {
    user: User | undefined
    shoppingList: ShoppingListItem[]
    loginEnabled: boolean
    shoppingListRef: { current?: DocumentRef }
    reorderShoppingList: (reorderParams: ReorderParams<ShoppingListItem>) => void
}

const Context = React.createContext<AuthContext>({
    user: undefined,
    shoppingList: [],
    loginEnabled: false,
    shoppingListRef: { current: undefined },
    reorderShoppingList: (reorderParams: ReorderParams<ShoppingListItem>) => null,
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
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])

    const shoppingListRef = useRef<DocumentRef>()

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

        shoppingListRef.current = userDocRef.collection('shoppingList').doc('static')

        const shoppingListUnsubscribe = shoppingListRef.current.onSnapshot(snapshot => {
            setShoppingList(snapshot.data()?.list ?? [])
        })

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

    const reorderShoppingList = (reorderParams: ReorderParams<ShoppingListItem>) => {
        const reorderedList = ArrayFns.reorder(reorderParams)
        setShoppingList(reorderedList)
        shoppingListRef.current?.set({
            list: reorderedList,
        })
    }

    return (
        <Context.Provider
            value={{ user, loginEnabled, shoppingList, shoppingListRef, reorderShoppingList }}>
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
