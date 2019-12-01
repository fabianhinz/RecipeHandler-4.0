import { Card, CardContent, List } from '@material-ui/core'
import React, { useEffect } from 'react'

import { FirebaseService } from '../../services/firebase'

const Admin = () => {
    useEffect(() => {
        FirebaseService.firestore
            .collection('editors')
            .doc('test')
            .set({ hi: 'hi' })
        FirebaseService.firestore
            .collection('editors')
            .onSnapshot(snapshot =>
                console.log(snapshot.docs.map(data => ({ id: data.id, data: data.data() })))
            )
    })

    useEffect(() => {
        FirebaseService.firestore
            .collection('users')
            .onSnapshot(snapshot =>
                console.log(snapshot.docs.map(data => ({ id: data.id, data: data.data() })))
            )
    }, [])

    return (
        <Card>
            <CardContent>
                <List></List>
            </CardContent>
        </Card>
    )
}

export default Admin
