import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { Editor } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import Progress from '../Shared/Progress'

const Context = React.createContext<{
    user: firebase.User | null
    editor: Editor | null
}>({
    user: null,
    editor: null,
})

export const useFirebaseAuthContext = () => useContext(Context)

export const FirebaseAuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null)
    const [editor, setEditor] = useState<Editor | null>(null)

    const handleAuthStateChange = useCallback((user: firebase.User | null) => {
        if (user) {
            setUser(user)
            if (user.isAnonymous) return
            // only registered users have a username

            FirebaseService.firestore
                .collection('users')
                .doc(user.uid)
                .get()
                .then(doc =>
                    setEditor({
                        username: (doc.data() as Pick<Editor, 'username'>).username,
                        uid: user.uid,
                    })
                )
        } else FirebaseService.auth.signInAnonymously()
    }, [])

    useEffect(() => {
        return FirebaseService.auth.onAuthStateChanged(handleAuthStateChange)
    }, [handleAuthStateChange])

    return (
        <Context.Provider value={{ user, editor }}>
            {user ? children : <Progress variant="fixed" />}
        </Context.Provider>
    )
}
