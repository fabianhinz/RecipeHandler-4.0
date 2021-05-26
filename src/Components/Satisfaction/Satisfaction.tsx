import { Grid, Tooltip } from '@material-ui/core'
import SatisfactionBackgroundIcon from '@material-ui/icons/SupervisedUserCircle'
import { Rating } from '@material-ui/lab'
import React, { ReactText, useCallback, useEffect, useMemo, useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import StyledCard from '../Shared/StyledCard'
import SatisfactionIconContainer from './SatisfactionIconContainer'
import SatisfactionUser from './SatisfactionUser'

interface Props {
    recipeName: string
}

const Satisfaction = ({ recipeName }: Props) => {
    const [satisfaction, setSatisfaction] = useState<Map<string, number>>(new Map())
    const [tooltipTitle, setTooltipTitle] = useState<ReactText>('')

    const { user } = useFirebaseAuthContext()
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

    const satisfactionValueOrNull = useCallback(
        (uid: string) => satisfaction.get(uid) || null,
        [satisfaction]
    )

    const handleActiveChange = (_event: React.ChangeEvent<{}>, value: number) => {
        switch (value) {
            case 1: {
                setTooltipTitle('Das war wohl nix')
                break
            }
            case 2: {
                setTooltipTitle('Geht so')
                break
            }
            case 3: {
                setTooltipTitle('Nomnomnom')
                break
            }
            case 4: {
                setTooltipTitle('Wie - nichts mehr da?')
                break
            }
            case 5: {
                setTooltipTitle('Ich will meeeehr')
                break
            }
        }
    }

    return (
        <StyledCard
            header="Bewertungen"
            BackgroundIcon={SatisfactionBackgroundIcon}
            action={
                user && (
                    <Tooltip title={tooltipTitle} placement="bottom-start">
                        <Rating
                            value={satisfactionValueOrNull(user.uid)}
                            onChange={handleSatisfactionChange}
                            onChangeActive={handleActiveChange}
                            name="recipe-editor-satisfaction"
                            size="large"
                            IconContainerComponent={SatisfactionIconContainer}
                        />
                    </Tooltip>
                )
            }>
            <Grid container spacing={2} alignItems="center">
                {userIds
                    .filter(uid => uid !== user?.uid)
                    .map(uid => (
                        <Grid item key={uid}>
                            <SatisfactionUser
                                disabled
                                value={satisfactionValueOrNull(uid)}
                                uid={uid}
                            />
                        </Grid>
                    ))}
            </Grid>
        </StyledCard>
    )
}

export default Satisfaction
