import {
    Card,
    CardActionArea,
    CardMedia,
    createStyles,
    Grid,
    Grow,
    IconButton,
    makeStyles,
    Slide,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { DataUrls, getRefPaths, getResizedImages } from '../../hooks/useAttachmentRef'
import { TRANSITION_DURATION } from '../../hooks/useTransition'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
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
            boxShadow: theme.shadows[8],
            position: 'absolute',
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: theme.spacing(1),
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: `0px 0px ${BORDER_RADIUS}px  ${BORDER_RADIUS}px `,
            backgroundColor: theme.palette.background.paper,
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
        const { smallPath, mediumPath } = getRefPaths(trial.fullPath)
        try {
            await FirebaseService.firestore
                .collection('trials')
                .doc(trial.name)
                .delete()

            // ! This logic should be in a cloud function
            await FirebaseService.storageRef.child(trial.fullPath).delete()
            await FirebaseService.storageRef.child(smallPath).delete()
            await FirebaseService.storageRef.child(mediumPath).delete()
        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' })
        }
    }

    return (
        <>
            <Grid item xs={12} sm={6} lg={4} xl={3} key={trial.name}>
                <Grow
                    in
                    timeout={{
                        enter: index === 0 ? TRANSITION_DURATION : TRANSITION_DURATION * index,
                        exit: TRANSITION_DURATION,
                    }}>
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
                            <Slide direction="up" in>
                                <div className={classes.actions}>
                                    <Comments
                                        collection="trials"
                                        numberOfComments={trial.numberOfComments}
                                        name={trial.name}
                                    />

                                    <IconButton onClick={() => setDeleteAlert(true)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
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
