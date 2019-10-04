import {
    Box,
    Card,
    CardHeader,
    CardMedia,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    Fab,
    IconButton,
    makeStyles,
    MobileStepper,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import StarsIcon from '@material-ui/icons/StarsTwoTone'
import compressImage from 'browser-image-compression'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import SwipeableViews from 'react-swipeable-views'

import { FirebaseService } from '../../../firebase'
import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { readDocumentAsync } from '../../Recipe/Create/Attachements/RecipeCreateAttachements'
import { SlideUp } from '../../Shared/Transitions'
import { HeaderDispatch, HeaderState } from './HeaderReducer'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
        },
        cardMedia: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
        dialogPaper: {
            position: 'relative',
            overflow: 'unset',
        },
        fabContainer: {
            position: 'absolute',
            top: -25,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
        },
        mobileStepper: {
            flexGrow: 1,
            background: 'unset',
        },
    })
)

interface Trial {
    fullPath: string
    name: string
    createdDate: firebase.firestore.Timestamp
}

type HeaderTrialsProps = HeaderState<'trialsOpen'> & HeaderDispatch

export const HeaderTrials: FC<HeaderTrialsProps> = ({ trialsOpen, dispatch }) => {
    const [trials, setTrials] = useState<Map<string, Trial>>(new Map())
    const [activeTrial, setActiveTrial] = useState(0)
    const classes = useStyles()

    // const { isDialogFullscreen } = useBreakpointsContext()
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

                    const fullPath = await uploadTask.ref.getDownloadURL()

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

    return (
        <Dialog
            open={trialsOpen}
            onClose={() => dispatch({ type: 'trialsChange' })}
            maxWidth="sm"
            fullWidth
            TransitionComponent={SlideUp}
            PaperProps={{ className: classes.dialogPaper }}>
            <DialogContent>
                <SwipeableViews
                    index={activeTrial}
                    onChangeIndex={index => setActiveTrial(index)}
                    enableMouseEvents>
                    {[...trials.values()].map(trial => (
                        <Card key={trial.name}>
                            <CardHeader
                                title={trial.name}
                                subheader={FirebaseService.createDateFromTimestamp(
                                    trial.createdDate
                                ).toLocaleDateString()}
                                action={
                                    <>
                                        <IconButton>
                                            <StarsIcon />
                                        </IconButton>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                            />

                            <CardMedia className={classes.cardMedia} image={trial.fullPath} />
                        </Card>
                    ))}
                </SwipeableViews>
                {trials.size === 0 && (
                    <Box display="flex" justifyContent="center">
                        <NotFoundIcon width={200} />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <MobileStepper
                    className={classes.mobileStepper}
                    steps={trials.size}
                    position="static"
                    variant="text"
                    activeStep={activeTrial}
                    nextButton={
                        <IconButton
                            onClick={() => setActiveTrial(prev => ++prev)}
                            disabled={activeTrial === trials.size - 1}>
                            <KeyboardArrowRight />
                        </IconButton>
                    }
                    backButton={
                        <IconButton
                            onClick={() => setActiveTrial(prev => --prev)}
                            disabled={activeTrial === 0}>
                            <KeyboardArrowLeft />
                        </IconButton>
                    }
                />
            </DialogActions>
            <div className={classes.fabContainer} {...getRootProps()}>
                <Fab color="primary">
                    <input {...getInputProps()} />
                    <AddIcon />
                </Fab>
            </div>
        </Dialog>
    )
}
