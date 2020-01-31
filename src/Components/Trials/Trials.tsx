import { Box, createStyles, Fab, Grid, makeStyles, Typography, Zoom } from '@material-ui/core'
import CameraIcon from '@material-ui/icons/CameraTwoTone'
import compressImage from 'browser-image-compression'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { getFileExtension } from '../../hooks/useAttachmentRef'
import { ReactComponent as TrialIcon } from '../../icons/logo.svg'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { readDocumentAsync } from '../Recipe/Create/Attachments/useAttachmentDropzone'
import Progress from '../Shared/Progress'
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
    const [trials, setTrials] = useState<Map<string, Trial>>(new Map())
    const [loading, setLoading] = useState(true)
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('trials')
                .orderBy('createdDate', 'desc')
                .onSnapshot(querySnapshot => {
                    setTrials(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as Trial])))
                    setLoading(false)
                }),
        []
    )

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
            {loading ? (
                <Progress variant="fixed" />
            ) : trials.size === 0 ? (
                <Box display="flex" justifyContent="center" padding={4}>
                    <TrialIcon width={200} />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Rezeptideen</Typography>
                    </Grid>
                    {[...trials.values()].map((trial, index) => (
                        <TrialsCard index={index} trial={trial} key={trial.name} />
                    ))}
                </Grid>
            )}

            {user && (
                <Zoom in>
                    <div className={classes.fabContainer} {...getRootProps()}>
                        <Fab color="secondary">
                            <input {...getInputProps()} />
                            <CameraIcon />
                        </Fab>
                    </div>
                </Zoom>
            )}
        </>
    )
}

export default Trials
