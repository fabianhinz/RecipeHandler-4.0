import { Button, createStyles, Drawer, Grid, makeStyles } from '@material-ui/core'
import { Lightbulb } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'

import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import Skeletons from '../Shared/Skeletons'
import TrialsCard from './TrialsCard'

const useStyles = makeStyles(theme =>
    createStyles({
        btn: {
            fontFamily: 'Ubuntu',
            textTransform: 'unset',
        },
        containerSelectionWrapper: {
            // ? about the same height as BackgroundIcon
            height: '31vh',
        },
        drawerPaper: {
            padding: theme.spacing(2),
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    })
)

interface Props {
    selectedTrial?: Trial
    onSelectedTrialChange: (selectedTrial?: Trial) => void
}

const TrialsSelection = ({ selectedTrial, onSelectedTrialChange }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [trials, setTrials] = useState<Trial[]>([])

    const classes = useStyles()

    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        if (!drawerOpen || !user) return

        return FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')
            .where('editorUid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                setLoading(false)
                setTrials(querySnapshot.docs.map(doc => doc.data() as Trial))
            })
    }, [drawerOpen, user])

    const closeDrawer = () => setDrawerOpen(false)
    const openDrawer = () => setDrawerOpen(true)

    const handleTrialCardClick = (trial: Trial) => {
        if (trial.name !== selectedTrial?.name) onSelectedTrialChange(trial)
        else onSelectedTrialChange(undefined)
    }

    return (
        <>
            <Button
                onClick={openDrawer}
                variant="contained"
                size="large"
                startIcon={<Lightbulb />}
                color={selectedTrial ? 'secondary' : 'default'}
                className={classes.btn}
                fullWidth>
                Idee verknüpfen
            </Button>

            <Drawer
                PaperProps={{ className: classes.drawerPaper }}
                BackdropProps={{ invisible: true }}
                ModalProps={{ disableScrollLock: true }}
                open={drawerOpen}
                onClose={closeDrawer}
                anchor="top"
                keepMounted>
                <Grid container spacing={2} wrap="nowrap">
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
            </Drawer>
        </>
    )
}

export default TrialsSelection
