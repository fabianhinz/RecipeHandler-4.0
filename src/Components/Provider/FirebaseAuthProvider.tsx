import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import Progress from '../Shared/Progress'

const Context = React.createContext<{ user: User | null }>({ user: null })

export const useFirebaseAuthContext = () => useContext(Context)

let userDocUnsubscribe: any = undefined

const FirebaseAuthProvider: FC = ({ children }) => {
    const [authReady, setAuthReady] = useState(false)
    const [user, setUser] = useState<User | null>(null)

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
            {authReady ? children : <Progress variant="fixed" />}
        </Context.Provider>
    )
}

export default FirebaseAuthProvider
