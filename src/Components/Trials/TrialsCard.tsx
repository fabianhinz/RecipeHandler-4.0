import {
    Card,
    CardActionArea,
    CardMedia,
    createStyles,
    Fab,
    Grid,
    Grow,
    makeStyles,
    Slide,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { DataUrls, getResizedImages } from '../../hooks/useAttachmentRef'
import { getTransitionTimeoutProps } from '../../hooks/useTransition'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import AccountChip from '../Account/AccountChip'
import { Comments } from '../Comments/Comments'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
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
    const [dataUrls, setDataUrls] = useState<DataUrls | undefined>()
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar } = useSnackbar()
    const { setSelectedAttachment } = useSelectedAttachement()

    useEffect(() => {
        let mounted = true
        getResizedImages(trial.fullPath).then(urls => {
            if (mounted) setDataUrls(urls)
        })
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
            <Grid item xs={12} md={6} lg={4} key={trial.name}>
                <Grow in timeout={getTransitionTimeoutProps(++index)}>
                    <Card className={classes.card}>
                        <AccountChip uid={trial.editorUid} variant="absolute" />

                        <CardActionArea
                            disabled={!dataUrls}
                            onClick={() => {
                                if (dataUrls) setSelectedAttachment(dataUrls.fullDataUrl)
                            }}>
                            <CardMedia
                                image={dataUrls && dataUrls.mediumDataUrl}
                                className={classes.img}>
                                {/* make mui happy */}
                                <></>
                            </CardMedia>
                        </CardActionArea>

                        {user && (
                            <Slide direction="up" in timeout={getTransitionTimeoutProps(++index)}>
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
                </Grow>
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
