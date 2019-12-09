import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
    Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { AccountContentProps } from './AccountDialog'

const editorsCollection = FirebaseService.firestore.collection('editors')

type Props = Pick<AccountContentProps, 'onDialogLoading'>

const AccountContentAdmin = ({ onDialogLoading }: Props) => {
    const [users, setUsers] = useState<Array<User>>([])
    const [editors, setEditors] = useState<Set<string>>(new Set())

    useEffect(() => {
        return editorsCollection.onSnapshot(snapshot =>
            setEditors(new Set(snapshot.docs.map(doc => doc.id)))
        )
    }, [])

    useEffect(() => {
        onDialogLoading(true)
        return FirebaseService.firestore.collection('users').onSnapshot(querySnapshot => {
            setUsers(querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)))
            onDialogLoading(false)
        })
    }, [onDialogLoading])

    const handleSwitchChange = (uid: string) => () => {
        if (editors.has(uid)) editorsCollection.doc(uid).delete()
        else editorsCollection.doc(uid).set({ wildcard: true })
    }

    return (
        <List>
            {users.map(({ uid, username }) => (
                <ListItem key={uid}>
                    <ListItemAvatar>
                        <Avatar>{username.slice(0, 1)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={username} secondary="tbd" />
                    <ListItemSecondaryAction>
                        <Switch
                            checked={editors.has(uid)}
                            onChange={handleSwitchChange(uid)}
                            edge="end"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    )
}

export default AccountContentAdmin
