import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import Progress from '../Shared/Progress'

const Context = React.createContext<{
    anonymousUser: boolean
    firebaseUser: firebase.User | null
    editor: User | null
}>({
    anonymousUser: false,
    firebaseUser: null,
    editor: null,
})

export const useFirebaseAuthContext = () => useContext(Context)

const FirebaseAuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null)
    const [editor, setEditor] = useState<User | null>(null)

    const handleAuthStateChange = useCallback((user: firebase.User | null) => {
        if (user) {
            setUser(user)
            if (user.isAnonymous) return
            // only registered users have a additional props

            FirebaseService.firestore
                .collection('users')
                .doc(user.uid)
                .get()
                .then(doc =>
                    setEditor({
                        ...(doc.data() as Omit<User, 'uid'>),
                        uid: user.uid,
                    })
                )
        } else FirebaseService.auth.signInAnonymously()
    }, [])

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(handleAuthStateChange)
    }, [handleAuthStateChange])

    return (
        <Context.Provider
            value={{
                firebaseUser: user,
                editor,
                anonymousUser: user && user.isAnonymous ? true : false,
            }}>
            {user ? children : <Progress variant="fixed" />}
        </Context.Provider>
    )
}

export default FirebaseAuthProvider
