import {
    Box,
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    makeStyles,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import compressImage from 'browser-image-compression'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { FirebaseService } from '../../../../firebase'
import { getFileExtension } from '../../../../hooks/useAttachementRef'
import { ReactComponent as TrialIcon } from '../../../../icons/logo.svg'
import { Trial } from '../../../../model/model'
import { useBreakpointsContext } from '../../../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../../../Provider/FirebaseAuthProvider'
import { readDocumentAsync } from '../../../Recipe/Create/Attachements/RecipeCreateAttachements'
import { Loading } from '../../../Shared/Loading'
import { SlideUp } from '../../../Shared/Transitions'
import { HeaderDispatch, HeaderState } from '../HeaderReducer'
import { HeaderTrialsCard } from './HeaderTrialsCard'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
        dialogPaper: {
            position: 'relative',
        },
        fabContainer: {
            outline: 'none',
            position: 'absolute',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
        },
        dialogTitle: {
            textAlign: 'center',
        },
    })
)

type HeaderTrialsProps = HeaderState<'trialsOpen'> & HeaderDispatch

export const HeaderTrials: FC<HeaderTrialsProps> = ({ trialsOpen, dispatch }) => {
    const [trials, setTrials] = useState<Map<string, Trial>>(new Map())
    const [loading, setLoading] = useState(false)
    const classes = useStyles()

    const { isDialogFullscreen } = useBreakpointsContext()
    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        if (!trialsOpen) return

        setLoading(true)
        return FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')
            .onSnapshot(querySnapshot => {
                setTrials(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as Trial])))
                setLoading(false)
            })
    }, [trialsOpen])

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
        <Dialog
            open={trialsOpen}
            keepMounted
            onClose={() => dispatch({ type: 'trialsChange' })}
            maxWidth="md"
            fullWidth
            fullScreen={isDialogFullscreen}
            TransitionComponent={SlideUp}
            PaperProps={{ className: classes.dialogPaper }}>
            <DialogTitle className={classes.dialogTitle}>Versuchskaninchen</DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Loading />
                ) : trials.size === 0 ? (
                    <Box display="flex" justifyContent="center" padding={4}>
                        <TrialIcon width={200} />
                    </Box>
                ) : (
                    <Box padding={2}>
                        <Grid container spacing={4}>
                            {[...trials.values()].map(trial => (
                                <HeaderTrialsCard
                                    trial={trial}
                                    dispatch={dispatch}
                                    key={trial.name}
                                />
                            ))}
                        </Grid>
                    </Box>
                )}

                {user && !user.isAnonymous && (
                    <div className={classes.fabContainer} {...getRootProps()}>
                        <Fab color="primary">
                            <input {...getInputProps()} />
                            <AddIcon />
                        </Fab>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
