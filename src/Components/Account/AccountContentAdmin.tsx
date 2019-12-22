import {
    Avatar,
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Switch,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { User } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useUsersContext } from '../Provider/UsersProvider'
import { AccountContentProps } from './AccountDialog'

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

    const handleEditorChange = (uid: string) => () => {
        if (editors.has(uid)) editorsCollection.doc(uid).delete()
        else editorsCollection.doc(uid).set({ wildcard: true })
    }

    return (
        <List>
            {userIds.map(uid => (
                <UserListItem
                    key={uid}
                    uid={uid}
                    editor={editors.has(uid)}
                    onEditorChange={handleEditorChange}
                />
            ))}
        </List>
    )
}

export default AccountContentAdmin

interface UserListItemProps {
    uid: string
    editor: boolean
    onEditorChange: (uid: string) => () => void
}

const useStyles = makeStyles(theme =>
    createStyles({
        itemAvatar: {
            minWidth: 66,
        },
        avatar: {
            width: 50,
            height: 50,
            margin: '8px 0px',
        },
    })
)

const UserListItem = ({ uid, onEditorChange, editor }: UserListItemProps) => {
    const { getByUid } = useUsersContext()
    const { username, profilePicture, createdDate } = getByUid(uid) as User

    const classes = useStyles()

    return (
        <ListItem button onClick={onEditorChange(uid)}>
            <ListItemAvatar className={classes.itemAvatar}>
                <Avatar className={classes.avatar} src={profilePicture}>
                    {username.slice(0, 1)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={username}
                secondary={FirebaseService.createDateFromTimestamp(createdDate).toLocaleString()}
            />
            <ListItemSecondaryAction>
                <Switch checked={editor} edge="start" />
            </ListItemSecondaryAction>
        </ListItem>
    )
}
