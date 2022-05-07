import React, { FC, useContext, useEffect, useState } from 'react'

import { DocumentId, User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from './FirebaseAuthProvider'

const Context = React.createContext<{
  getByUid: (uid: string) => User | undefined
  userIds: DocumentId[]
}>({
  getByUid: () => undefined,
  userIds: [],
})

export const useUsersContext = () => useContext(Context)

const UsersProvider: FC = ({ children }) => {
  const [users, setUsers] = useState<Map<DocumentId, User>>(new Map())
  const authContext = useFirebaseAuthContext()
  // ! onShapshot would not scale ..., ToDo >> only username and profile picture should be in users/{id}
  // ! everything else as a subcollection
  useEffect(() => {
    FirebaseService.firestore
      .collection('users')
      .orderBy('username', 'asc')
      .get()
      .then(querySnapshot =>
        setUsers(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as User])))
      )
      .catch(e => {
        if (e.code === 'permission-denied') return
        throw new Error(e)
      })
    // fetch users after login
  }, [authContext.user])

  return (
    <Context.Provider
      value={{
        getByUid: uid => users.get(uid),
        userIds: [...users.keys()],
      }}>
      {children}
    </Context.Provider>
  )
}

export default UsersProvider
