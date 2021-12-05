import { List } from '@material-ui/core'
import SecurityIcon from '@material-ui/icons/VerifiedUser'
import React, { memo, useEffect, useState } from 'react'

import { FirebaseService } from '../../../services/firebase'
import { useUsersContext } from '../../Provider/UsersProvider'
import StyledCard from '../../Shared/StyledCard'
import AccountListItem from '../AccountListItem'

const editorsCollection = FirebaseService.firestore.collection('editors')

const AccountUserAdmin = () => {
    const [editors, setEditors] = useState<Set<string>>(new Set())

    const { userIds } = useUsersContext()

    useEffect(() => {
        return editorsCollection.onSnapshot(snapshot =>
            setEditors(new Set(snapshot.docs.map(doc => doc.id)))
        )
    }, [])

    const handleEditorChange = (uid: string) => {
        if (editors.has(uid)) editorsCollection.doc(uid).delete()
        else editorsCollection.doc(uid).set({ wildcard: true })
    }

    return (
        <StyledCard expandable header="Editoren" BackgroundIcon={SecurityIcon}>
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
