import React, { FC, useContext, useEffect, useState } from 'react'

import { DocumentId, User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

const Context = React.createContext<{ getByUid: (uid: string) => User | undefined }>({
    getByUid: () => undefined,
})

export const useUsersContext = () => useContext(Context)

const UsersProvider: FC = ({ children }) => {
    const [users, setUsers] = useState<Map<DocumentId, User>>(new Map())

    useEffect(() => {
        return FirebaseService.firestore
            .collection('users')
            .onSnapshot(querySnapshot =>
                setUsers(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as User])))
            )
    }, [])

    return (
        <Context.Provider value={{ getByUid: uid => users.get(uid) }}>{children}</Context.Provider>
    )
}

export default UsersProvider
