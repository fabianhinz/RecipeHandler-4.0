import {
    Card,
    CardActionArea,
    CardMedia,
    createStyles,
    Fab,
    Grid,
    makeStyles,
    Slide,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { getResizedImagesWithMetadata } from '../../hooks/useAttachment'
import { AllDataUrls, Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import AccountChip from '../Account/AccountChip'
import { Comments } from '../Comments/Comments'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import { useSelectedAttachement } from '../Provider/SelectedAttachementProvider'
import TrialsDeleteAlert from './TrialsDeleteAlert'

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
        card: {
            position: 'relative',
        },
        actions: {
            position: 'absolute',
            bottom: theme.spacing(1),
            right: theme.spacing(1),
        },
    })
)

interface Props {
    trial: Trial
    index: number
}

const TrialsCard = ({ trial, index }: Props) => {
    const [deleteAlert, setDeleteAlert] = useState(false)
    const [dataUrls, setDataUrls] = useState<AllDataUrls | undefined>()

    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { gridBreakpointProps } = useGridContext()
    const { enqueueSnackbar } = useSnackbar()
    const { setSelectedAttachment } = useSelectedAttachement()

    useEffect(() => {
        let mounted = true
        getResizedImagesWithMetadata(trial.fullPath).then(
            ({ fullDataUrl, mediumDataUrl, smallDataUrl }) => {
                if (!mounted) return
                setDataUrls({ fullDataUrl, mediumDataUrl, smallDataUrl })
            }
        )
        return () => {
            mounted = false
        }
    }, [trial.fullPath])

    const handleDeleteBtnClick = async () => {
        // ! this does not delete the comments collection --> should use https://firebase.google.com/docs/firestore/solutions/delete-collections
        // ! --> which is fine, we can recover comments even if the trial is lost
        try {
            await FirebaseService.firestore
                .collection('trials')
                .doc(trial.name)
                .delete()

            await FirebaseService.storageRef.child(trial.fullPath).delete()
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }

    return (
        <>
            <Grid item {...gridBreakpointProps} key={trial.name}>
                <Card className={classes.card}>
                    <AccountChip uid={trial.editorUid} variant="absolute" />

                    <CardActionArea
                        disabled={!dataUrls}
                        onClick={() => {
                            if (dataUrls) setSelectedAttachment({ dataUrl: dataUrls.fullDataUrl })
                        }}>
                        <CardMedia
                            image={dataUrls && dataUrls.mediumDataUrl}
                            className={classes.img}>
                            {/* make mui happy */}
                            <></>
                        </CardMedia>
                    </CardActionArea>

                    {user && (
                        <Slide direction="up" in>
                            <Grid
                                container
                                justify="flex-end"
                                spacing={1}
                                className={classes.actions}>
                                <Grid item xs="auto">
                                    <Comments
                                        highContrast
                                        collection="trials"
                                        numberOfComments={trial.numberOfComments}
                                        name={trial.name}
                                    />
                                </Grid>

                                <Grid item xs="auto">
                                    <Fab size="small" onClick={() => setDeleteAlert(true)}>
                                        <DeleteIcon />
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Slide>
                    )}
                </Card>
            </Grid>
            <TrialsDeleteAlert
                open={deleteAlert}
                title={trial.name}
                onAbort={() => setDeleteAlert(false)}
                onConfirm={handleDeleteBtnClick}
            />
        </>
    )
}

export default TrialsCard
