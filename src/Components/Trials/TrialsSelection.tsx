import { Grid } from '@material-ui/core'
import { Lightbulb } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'

import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import SelectionDrawer from '../Shared/SelectionDrawer'
import Skeletons from '../Shared/Skeletons'
import TrialsCard from './TrialsCard'

interface Props {
    selectedTrial?: Trial
    onSelectedTrialChange: (selectedTrial?: Trial) => void
}

const TrialsSelection = ({ selectedTrial, onSelectedTrialChange }: Props) => {
    const [loading, setLoading] = useState(true)
    const [shouldLoad, setShouldLoad] = useState(false)
    const [trials, setTrials] = useState<Trial[]>([])

    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        if (!user || !shouldLoad) return

        return FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')
            .where('editorUid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                setLoading(false)
                setTrials(querySnapshot.docs.map(doc => doc.data() as Trial))
            })
    }, [shouldLoad, user])

    const handleTrialCardClick = (trial: Trial) => {
        if (trial.name !== selectedTrial?.name) onSelectedTrialChange(trial)
        else onSelectedTrialChange(undefined)
    }

    return (
        <SelectionDrawer
            onOpen={() => setShouldLoad(true)}
            onClose={() => setShouldLoad(false)}
            buttonProps={{
                startIcon: <Lightbulb />,
                label: 'Idee verknüpfen',
                highlight: Boolean(selectedTrial),
            }}>
            <Grid container spacing={2}>
                {trials.map(trial => (
                    <TrialsCard
                        selectionProps={{
                            loadSmallAttachment: true,
                            selected: trial.name === selectedTrial?.name,
                            onClick: handleTrialCardClick,
                        }}
                        key={trial.name}
                        trial={trial}
                    />
                ))}
                <Skeletons visible={loading} variant="recipeTrial" />
            </Grid>
        </SelectionDrawer>
    )
}

export default TrialsSelection
