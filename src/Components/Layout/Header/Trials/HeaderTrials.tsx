import {
    Box,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    Fab,
    makeStyles,
    Tooltip,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import compressImage from 'browser-image-compression'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import SwipeableViews from 'react-swipeable-views'

import { FirebaseService } from '../../../../firebase'
import { ReactComponent as NotFoundIcon } from '../../../../icons/notFound.svg'
import { Trial } from '../../../../model/model'
import { useFirebaseAuthContext } from '../../../Provider/FirebaseAuthProvider'
import { readDocumentAsync } from '../../../Recipe/Create/Attachements/RecipeCreateAttachements'
import { SlideUp } from '../../../Shared/Transitions'
import { HeaderDispatch, HeaderState } from '../HeaderReducer'
import { HeaderTrialsCard } from './HeaderTrialsCard'
import { HeaderTrialsStepper } from './HeaderTrialsStepper'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
        dialogPaper: {
            position: 'relative',
            overflow: 'unset',
        },
        fabContainer: {
            outline: 'none',
            position: 'absolute',
            top: -25,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
        },
    })
)

type HeaderTrialsProps = HeaderState<'trialsOpen'> & HeaderDispatch

export const HeaderTrials: FC<HeaderTrialsProps> = ({ trialsOpen, dispatch }) => {
    const [trials, setTrials] = useState<Map<string, Trial>>(new Map())
    const [activeTrial, setActiveTrial] = useState(0)
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        if (!trialsOpen) return
        return FirebaseService.firestore
            .collection('trials')
            .orderBy('createdDate', 'desc')
            .onSnapshot(querySnapshot =>
                setTrials(new Map(querySnapshot.docs.map(doc => [doc.id, doc.data() as Trial])))
            )
    }, [trialsOpen])

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const snackKey = enqueueSnackbar('Dateien werden verarbeitet und hochgeladen', {
                variant: 'info',
            })

            for (const file of acceptedFiles) {
                const potentialDublicate = await FirebaseService.firestore
                    .collection('trials')
                    .doc(file.name)
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
                        .doc(file.name)
                        .set({
                            name: file.name,
                            fullPath,
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

    const handleTrialDeleted = (index: number) => () => {
        if (index === trials.size - 1 && index > 0) setActiveTrial(prev => --prev)
    }

    return (
        <Dialog
            open={trialsOpen}
            keepMounted
            onClose={() => dispatch({ type: 'trialsChange' })}
            maxWidth="md"
            fullWidth
            TransitionComponent={SlideUp}
            PaperProps={{ className: classes.dialogPaper }}>
            <DialogContent>
                <SwipeableViews
                    index={activeTrial}
                    onChangeIndex={index => setActiveTrial(index)}
                    enableMouseEvents>
                    {[...trials.values()].map((trial, index) => (
                        <HeaderTrialsCard
                            trial={trial}
                            onTrialDeleted={handleTrialDeleted(index)}
                            dispatch={dispatch}
                            key={trial.name}
                        />
                    ))}
                </SwipeableViews>
                {trials.size === 0 && (
                    <Box display="flex" justifyContent="center" padding={4}>
                        <NotFoundIcon width={200} />
                    </Box>
                )}
            </DialogContent>
            {trials.size > 0 && (
                <DialogActions>
                    <HeaderTrialsStepper
                        steps={trials.size}
                        activeStep={activeTrial}
                        onNext={() => setActiveTrial(prev => ++prev)}
                        onPrevious={() => setActiveTrial(prev => --prev)}
                    />
                </DialogActions>
            )}
            {user && (
                <div className={classes.fabContainer} {...getRootProps()}>
                    <Tooltip title="Idee(n) hinzufügen">
                        <Fab color="primary">
                            <input {...getInputProps()} />
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </div>
            )}
        </Dialog>
    )
}
