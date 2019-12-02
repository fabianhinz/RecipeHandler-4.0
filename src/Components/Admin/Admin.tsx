import {
    Avatar,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
    Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { Editor } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

// Editors and Users share the same props
type User = Editor

const editorsCollection = FirebaseService.firestore.collection('editors')

const Admin = () => {
    const [users, setUsers] = useState<Array<User>>([])
    const [editors, setEditors] = useState<Set<string>>(new Set())

    useEffect(() => {
        return editorsCollection.onSnapshot(snapshot =>
            setEditors(new Set(snapshot.docs.map(doc => doc.id)))
        )
    }, [])

    useEffect(() => {
        return FirebaseService.firestore
            .collection('users')
            .onSnapshot(querySnapshot =>
                setUsers(querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)))
            )
    }, [])

    const handleSwitchChange = (uid: string) => () => {
        if (editors.has(uid)) editorsCollection.doc(uid).delete()
        else editorsCollection.doc(uid).set({ wildcard: true })
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary">TBD e.g. recharts</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Admin
