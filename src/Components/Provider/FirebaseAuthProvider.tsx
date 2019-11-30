import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import Progress from '../Shared/Progress'

const Context = React.createContext<{ user: firebase.User | null }>({
    user: null,
})

export const useFirebaseAuthContext = () => useContext(Context)

export const FirebaseAuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null)

    const handleAuthStateChange = useCallback(async (user: firebase.User | null) => {
        if (user) {
            setUser(user)
            if (user.isAnonymous) return

            const userDocRef = FirebaseService.firestore.collection('users').doc(user.uid)
            const userShapshot = await userDocRef.get()

            if (userShapshot.exists) {
                userDocRef.update({ numberOfLogins: FirebaseService.incrementBy(1) })
            } else {
                userDocRef.set({ numberOfLogins: 1, email: user.email })
            }
        } else FirebaseService.auth.signInAnonymously()
    }, [])

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(handleAuthStateChange)
    }, [handleAuthStateChange])

    return (
        <Context.Provider value={{ user }}>
            {user ? children : <Progress variant="fixed" />}
        </Context.Provider>
    )
}
