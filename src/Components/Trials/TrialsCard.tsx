import {
    Box,
    Card,
    CardMedia,
    createStyles,
    Grid,
    Grow,
    IconButton,
    makeStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import { DataUrls, getRefPaths, getResizedImages } from '../../hooks/useAttachmentRef'
import { TRANSITION_DURATION } from '../../hooks/useTransition'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { Comments } from '../Comments/Comments'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import TrialsDeleteAlert from './TrialsDeleteAlert'

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
    })
)

interface Props {
    trial: Trial
    index: number
}

const TrialsCard = ({ trial, index }: Props) => {
    const [deleteAlert, setDeleteAlert] = useState(false)
    const [dataUrls, setDataUrls] = useState<DataUrls | null>()
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()
    const { enqueueSnackbar } = useSnackbar()

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
            <Grid item xs={12} md={6} lg={4} xl={3} key={trial.name}>
                <Grow
                    in={dataUrls ? true : false}
                    timeout={{
                        enter: index === 0 ? TRANSITION_DURATION : TRANSITION_DURATION * index,
                        exit: TRANSITION_DURATION,
                    }}>
                    <Card raised>
                        {dataUrls && (
                            <a
                                href={dataUrls.fullDataUrl}
                                rel="noreferrer noopener"
                                target="_blank">
                                <CardMedia image={dataUrls.mediumDataUrl} className={classes.img} />
                            </a>
                        )}
                        {user && (
                            <Box padding={1} display="flex" justifyContent="space-evenly">
                                <Comments
                                    collection="trials"
                                    numberOfComments={trial.numberOfComments}
                                    name={trial.name}
                                />

                                <IconButton onClick={() => setDeleteAlert(true)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Card>
                </Grow>
            </Grid>
            <TrialsDeleteAlert
                open={deleteAlert}
                onAbort={() => setDeleteAlert(false)}
                onConfirm={handleDeleteBtnClick}
            />
        </>
    )
}

export default TrialsCard
