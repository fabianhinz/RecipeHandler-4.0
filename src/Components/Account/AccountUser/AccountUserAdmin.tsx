import { List } from '@mui/material'
import SecurityIcon from '@mui/icons-material/VerifiedUser'
import { deleteDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { memo, useEffect, useState } from 'react'

import { useUsersContext } from '@/Components/Provider/UsersProvider'
import StyledCard from '@/Components/Shared/StyledCard'
import { resolveCollection, resolveDoc } from '@/firebase/firebaseQueries'

import AccountListItem from '../AccountListItem'

const AccountUserAdmin = () => {
  const [editors, setEditors] = useState<Set<string>>(new Set())

  const { userIds } = useUsersContext()

  useEffect(() => {
    return onSnapshot(resolveCollection('editors'), snapshot => {
      setEditors(new Set(snapshot.docs.map(doc => doc.id)))
    })
  }, [])

  const handleEditorChange = (uid: string) => {
    const docReference = resolveDoc('editors', uid)
    if (editors.has(uid)) {
      deleteDoc(docReference)
    } else {
      setDoc(docReference, { wildcard: true })
    }
  }

  return (
    <StyledCard expandable header="Autoren" BackgroundIcon={SecurityIcon}>
      <List>
        {userIds.map(uid => (
          <AccountListItem
            key={uid}
            uid={uid}
            variant="admin"
            checked={editors.has(uid)}
            onChange={handleEditorChange}
          />
        ))}
      </List>
    </StyledCard>
  )
}

export default memo(AccountUserAdmin)
