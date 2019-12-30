import { List } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'
import { AccountContentProps } from './AccountDialog'
import AccountListItem from './AccountListItem'

const editorsCollection = FirebaseService.firestore.collection('editors')

type Props = Pick<AccountContentProps, 'onDialogLoading'>

const AccountContentAdmin = ({ onDialogLoading }: Props) => {
    const [editors, setEditors] = useState<Set<string>>(new Set())

    const { userIds } = useUsersContext()

    useEffect(() => {
        onDialogLoading(true)
        return editorsCollection.onSnapshot(snapshot => {
            setEditors(new Set(snapshot.docs.map(doc => doc.id)))
            onDialogLoading(false)
        })
    }, [onDialogLoading])

    const handleEditorChange = (uid: string) => {
        if (editors.has(uid)) editorsCollection.doc(uid).delete()
        else editorsCollection.doc(uid).set({ wildcard: true })
    }

    return (
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
    )
}

export default AccountContentAdmin
