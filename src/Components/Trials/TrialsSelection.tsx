import { Grid } from '@material-ui/core'
import { Lightbulb } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'

import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
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

    useEffect(() => {
        if (!shouldLoad) return

        return FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')
            .onSnapshot(querySnapshot => {
                setLoading(false)
                setTrials(querySnapshot.docs.map(doc => doc.data() as Trial))
            })
    }, [shouldLoad])

    const handleTrialCardClick = (trial: Trial) => {
        if (trial.name !== selectedTrial?.name) onSelectedTrialChange(trial)
        else onSelectedTrialChange(undefined)
    }

    return (
        <SelectionDrawer
            onOpen={() => setShouldLoad(true)}
            onClose={() => setShouldLoad(false)}
            buttonProps={{
                icon: <Lightbulb />,
                label: 'Idee verknüpfen',
            }}
            legend="Beim Speichern wird die Idee gelöscht"
            highlight={Boolean(selectedTrial)}>
            <Grid container spacing={2}>
                {trials.map(trial => (
                    <TrialsCard
                        selectionProps={{
                            selected: trial.name === selectedTrial?.name,
                            onClick: handleTrialCardClick,
                        }}
                        key={trial.name}
                        trial={trial}
                    />
                ))}
                <Skeletons visible={loading} variant="trialsSelection" />
            </Grid>
        </SelectionDrawer>
    )
}

export default TrialsSelection
