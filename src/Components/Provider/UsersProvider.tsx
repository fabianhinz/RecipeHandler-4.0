import React, { FC, useContext, useEffect, useState } from 'react'

import { DocumentId, User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from './FirebaseAuthProvider'

const Context = React.createContext<{
    getByUid: (uid: string) => User | undefined
    otherUserIds: DocumentId[]
}>({
    getByUid: () => undefined,
    otherUserIds: [],
})

export const useUsersContext = () => useContext(Context)

const UsersProvider: FC = ({ children }) => {
    const [users, setUsers] = useState<Map<DocumentId, User>>(new Map())
    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        return FirebaseService.firestore
            .collection('users')
            .onSnapshot(querySnapshot =>
                setUsers(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as User])))
            )
    }, [])

    return (
        <Context.Provider
            value={{
                getByUid: uid => users.get(uid),
                otherUserIds: [...users.keys()].filter(uid => {
                    if (user) return uid !== user.uid
                    else return uid
                }),
            }}>
            {children}
        </Context.Provider>
    )
}

export default UsersProvider
