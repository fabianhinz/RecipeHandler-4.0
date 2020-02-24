import { Grid } from '@material-ui/core'
import SatisfactionBackgroundIcon from '@material-ui/icons/SentimentVerySatisfied'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import StyledCard from '../Shared/StyledCard'
import SatisfactionUser from './SatisfactionUser'

interface Props {
    recipeName: string
}

const Satisfaction = ({ recipeName }: Props) => {
    const { user } = useFirebaseAuthContext()
    const [satisfaction, setSatisfaction] = useState<Map<string, number>>(new Map())

    const { userIds } = useUsersContext()

    const memoSatisfactionCollection = useMemo(
        () =>
            FirebaseService.firestore
                .collection('recipes')
                .doc(recipeName)
                .collection('satisfaction'),
        [recipeName]
    )

    useEffect(
        () =>
            memoSatisfactionCollection.onSnapshot(querySnapshot =>
                setSatisfaction(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data().value])))
            ),
        [memoSatisfactionCollection]
    )

    const handleSatisfactionChange = (_event: React.ChangeEvent<{}>, value: number | null) => {
        if (!user) return

        memoSatisfactionCollection.doc(user.uid).set({ value })
    }

    const satisfactionValueOrNull = useCallback((uid: string) => satisfaction.get(uid) || null, [
        satisfaction,
    ])

    return (
        <StyledCard header="Bewertungen" BackgroundIcon={SatisfactionBackgroundIcon}>
            <Grid container spacing={2} alignItems="center">
                {userIds.map(uid => (
                    <Grid item key={uid}>
                        <SatisfactionUser
                            disabled={uid !== user?.uid}
                            value={satisfactionValueOrNull(uid)}
                            onChange={handleSatisfactionChange}
                            uid={uid}
                        />
                    </Grid>
                ))}
            </Grid>
        </StyledCard>
    )
}

export default Satisfaction
