import { List } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import useProgress from '../../hooks/useProgress'
import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'
import AccountListItem from './AccountListItem'

const editorsCollection = FirebaseService.firestore.collection('editors')

const AccountAdmin = () => {
    const [editors, setEditors] = useState<Set<string>>(new Set())
    const { ProgressComponent, setProgress } = useProgress()

    const { userIds } = useUsersContext()

    useEffect(() => {
        setProgress(true)
        return editorsCollection.onSnapshot(snapshot => {
            setEditors(new Set(snapshot.docs.map(doc => doc.id)))
            setProgress(false)
        })
    }, [setProgress])

    const handleEditorChange = (uid: string) => {
        if (editors.has(uid)) editorsCollection.doc(uid).delete()
        else editorsCollection.doc(uid).set({ wildcard: true })
    }

    return (
        <>
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

            <ProgressComponent />
        </>
    )
}

export default AccountAdmin
