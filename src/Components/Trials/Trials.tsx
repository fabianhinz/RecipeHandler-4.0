import { Fab, Grid, LinearProgress, Tooltip } from '@material-ui/core'
import CameraIcon from '@material-ui/icons/Camera'
import compressImage from 'browser-image-compression'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { getFileExtension } from '../../hooks/useAttachment'
import { readDocumentAsync } from '../../hooks/useAttachmentDropzone'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import recipeService from '../../services/recipeService'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import EntryGridContainer from '../Shared/EntryGridContainer'
import FabContainer from '../Shared/FabContainer'
import NotFound from '../Shared/NotFound'
import Skeletons from '../Shared/Skeletons'
import TrialsCard from './TrialsCard'

// ToDo should use AttachmentDropzone hook
const Trials = () => {
    const [pagedTrials, setPagedTrials] = useState<Map<string, Trial>>(recipeService.pagedTrials)
    const [lastTrial, setLastTrial] = useState<Trial | undefined | null>(null)
    const [querying, setQuerying] = useState(false)

    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => {
            if (pagedTrials.size > 0) setLastTrial([...pagedTrials.values()].pop())
        },
    })

    useDocumentTitle('Ideen')

    useEffect(() => {
        setQuerying(true)
        let query:
            | firebase.default.firestore.CollectionReference
            | firebase.default.firestore.Query = FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')

        if (lastTrial) query = query.startAfter(lastTrial.createdDate)

        return query.limit(FirebaseService.QUERY_LIMIT).onSnapshot(querySnapshot => {
            const changes: Record<'added' | 'modified' | 'removed', Map<string, Trial>> = {
                added: new Map(),
                modified: new Map(),
                removed: new Map(),
            }
            querySnapshot
                .docChanges()
                .forEach(({ type, doc }) => changes[type].set(doc.id, doc.data() as Trial))

            setPagedTrials(trials => {
                changes.removed.forEach((_v, key) => trials.delete(key))
                const newTrials = new Map([...trials, ...changes.added, ...changes.modified])

                recipeService.pagedTrials = newTrials
                return newTrials
            })
            setQuerying(false)
        })
    }, [lastTrial])

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (!user) return

            const snackKey = enqueueSnackbar('Dateien werden verarbeitet und hochgeladen', {
                variant: 'info',
            })

            for (const file of acceptedFiles) {
                const name = file.name.replace(`.${getFileExtension(file.name)}`, '')
                const potentialDublicate = await FirebaseService.firestore
                    .collection('trials')
                    .doc(name)
                    .get()

                if (potentialDublicate.exists) {
                    enqueueSnackbar(
                        `Ein Versuchskaninchen mit dem Namen ${file.name} existiert bereits`,
                        {
                            variant: 'warning',
                        }
                    )
                    continue
                }
                const compressedFile: Blob = await compressImage(file, {
                    maxSizeMB: 0.5,
                    useWebWorker: false,
                    maxWidthOrHeight: 3840,
                    maxIteration: 5,
                })
                const dataUrl: string = await readDocumentAsync(compressedFile)

                try {
                    const uploadTask = await FirebaseService.storageRef
                        .child(`trials/${file.name}`)
                        .putString(dataUrl, 'data_url', {
                            cacheControl: 'public, max-age=31536000',
                        })

                    const fullPath = uploadTask.ref.fullPath

                    setPagedTrials(new Map())
                    setLastTrial(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })

                    await FirebaseService.firestore
                        .collection('trials')
                        .doc(name)
                        .set({
                            name,
                            fullPath,
                            numberOfComments: 0,
                            editorUid: user.uid,
                            createdDate: FirebaseService.createTimestampFromDate(new Date()),
                        } as Trial)
                } catch (e) {
                    enqueueSnackbar(e.message, { variant: 'error' })
                }
            }
            closeSnackbar(snackKey as string)
        },
        [closeSnackbar, enqueueSnackbar, user]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        noDragEventsBubbling: true,
        noDrag: true,
    })

    const handleTrialDelete = (trialName: string) => {
        // ? hacky...
        setPagedTrials(prev => {
            prev.delete(trialName)
            return new Map(prev)
        })
    }

    return (
        <>
            <EntryGridContainer>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {[...pagedTrials.values()].map(trial => (
                            <TrialsCard
                                onDelete={handleTrialDelete}
                                trial={trial}
                                key={trial.name}
                            />
                        ))}

                        <Skeletons variant="trial" visible={querying && pagedTrials.size === 0} />

                        <NotFound visible={!querying && pagedTrials.size === 0} />

                        <Grid item xs={12}>
                            {querying && <LinearProgress variant="query" color="secondary" />}
                            <IntersectionObserverTrigger />
                        </Grid>
                    </Grid>
                </Grid>
            </EntryGridContainer>

            {user && (
                <FabContainer>
                    <Tooltip title="Rezeptidee hinzufügen" placement="left">
                        <div {...getRootProps()}>
                            <Fab color="secondary">
                                <CameraIcon />
                            </Fab>
                        </div>
                    </Tooltip>
                </FabContainer>
            )}

            <input {...getInputProps()} />
        </>
    )
}

export default Trials
