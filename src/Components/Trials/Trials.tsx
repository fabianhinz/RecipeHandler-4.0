import {
    Box,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    makeStyles,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import compressImage from 'browser-image-compression'
import { Loading } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { getFileExtension } from '../../hooks/useAttachementRef'
import { ReactComponent as TrialIcon } from '../../icons/logo.svg'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { readDocumentAsync } from '../Recipe/Create/Attachements/useAttachementDropzone'
import { SlideUp } from '../Shared/Transitions'
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
            position: 'absolute',
            right: theme.spacing(2),
            bottom: theme.spacing(4.5),
        },
        dialogTitle: {
            textAlign: 'center',
        },
    })
)

interface Props {
    open: boolean
    onClose: () => void
}

const Trials = ({ open, onClose }: Props) => {
    const [trials, setTrials] = useState<Map<string, Trial>>(new Map())
    const [loading, setLoading] = useState(false)
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        if (!open) return

        setLoading(true)
        return FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')
            .onSnapshot(querySnapshot => {
                setTrials(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as Trial])))
                setLoading(false)
            })
    }, [open])

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
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
                    enqueueSnackbar(`Eine Datei mit dem Namen ${file.name} existiert bereits`, {
                        variant: 'info',
                    })
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
                            createdDate: FirebaseService.createTimestampFromDate(new Date()),
                        })
                } catch (e) {
                    enqueueSnackbar(e.message, { variant: 'error' })
                }
            }
            closeSnackbar(snackKey as string)
        },
        [closeSnackbar, enqueueSnackbar]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        noDragEventsBubbling: true,
        noDrag: true,
    })

    return (
        <Dialog open={open} keepMounted onClose={onClose} fullScreen TransitionComponent={SlideUp}>
            <DialogTitle className={classes.dialogTitle}>Versuchskaninchen</DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Loading />
                ) : trials.size === 0 ? (
                    <Box display="flex" justifyContent="center" padding={4}>
                        <TrialIcon width={200} />
                    </Box>
                ) : (
                    <Box paddingTop={1} paddingBottom={1}>
                        <Grid container spacing={3}>
                            {[...trials.values()].map(trial => (
                                <TrialsCard trial={trial} key={trial.name} />
                            ))}
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Box flexGrow={1} display="flex" justifyContent="space-evenly" alignItems="center">
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {user && !user.isAnonymous && (
                    <div className={classes.fabContainer} {...getRootProps()}>
                        <Fab color="secondary">
                            <input {...getInputProps()} />
                            <AddIcon />
                        </Fab>
                    </div>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default memo(
    Trials,
    (prev, next) => prev.open === next.open && prev.onClose === next.onClose
)
