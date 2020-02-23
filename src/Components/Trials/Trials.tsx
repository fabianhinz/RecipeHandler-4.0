import {
    createStyles,
    Fab,
    Grid,
    LinearProgress,
    makeStyles,
    Tooltip,
    Typography,
    Zoom,
} from '@material-ui/core'
import CameraIcon from '@material-ui/icons/CameraTwoTone'
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
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import Skeletons from '../Shared/Skeletons'
import TrialsCard from './TrialsCard'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
        dialogActions: {
            position: 'relative',
        },
        fabContainer: {
            outline: 'none',
            zIndex: theme.zIndex.drawer + 1,
            position: 'fixed',
            right: theme.spacing(2),
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(4.5)}px)`,
        },
    })
)

const Trials = () => {
    const [pagedTrials, setPagedTrials] = useState<Map<string, Trial>>(new Map())
    const [lastTrial, setLastTrial] = useState<Trial | undefined | null>(null)
    const [querying, setQuerying] = useState(false)

    const classes = useStyles()

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
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')

        if (lastTrial) query = query.startAfter(lastTrial.createdDate)
        // ToDo refactor below --> merge with Home.tsx 69 ff.
        return query.limit(12).onSnapshot(querySnapshot => {
            const changes = {
                added: new Map(),
                modified: new Map(),
                removed: new Map(),
            }
            querySnapshot
                .docChanges()
                .forEach(({ type, doc }) => changes[type].set(doc.id, doc.data() as Trial))

            setPagedTrials(trials => {
                changes.removed.forEach((_v, key) => trials.delete(key))
                const newRecipes = new Map([...trials, ...changes.added, ...changes.modified])

                return newRecipes
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
                        .putString(dataUrl, 'data_url')

                    const fullPath = uploadTask.ref.fullPath

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

    return (
        <>
            <EntryGridContainer>
                <Grid item xs={12}>
                    <Typography variant="h4">Ideen</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {[...pagedTrials.values()].map((trial, index) => (
                            <TrialsCard index={index} trial={trial} key={trial.name} />
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
                <Zoom in>
                    <div className={classes.fabContainer} {...getRootProps()}>
                        <Tooltip title="Rezeptidee hinzufügen" placement="left">
                            <Fab color="secondary">
                                <input {...getInputProps()} />
                                <CameraIcon />
                            </Fab>
                        </Tooltip>
                    </div>
                </Zoom>
            )}
        </>
    )
}

export default Trials
