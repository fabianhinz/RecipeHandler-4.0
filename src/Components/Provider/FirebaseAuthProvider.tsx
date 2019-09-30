import React, { FC, useContext, useEffect, useState } from 'react'

import { FirebaseService } from '../../firebase'

const Context = React.createContext<{ user: firebase.User | null }>({ user: null })

export const useFirebaseAuthContext = () => useContext(Context)

export const FirebaseAuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null)

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(setUser)
    }, [])

    return <Context.Provider value={{ user }}>{children}</Context.Provider>
}
