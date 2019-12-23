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
import React, { useEffect, useState } from 'react'

import { DataUrls, getRefPaths, getResizedImages } from '../../hooks/useAttachmentRef'
import { TRANSITION_DURATION } from '../../hooks/useTransition'
import { Trial } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { Comments } from '../Comments/Comments'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

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
    const [dataUrls, setDataUrls] = useState<DataUrls | null>()
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()

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
        const { smallPath, mediumPath } = getRefPaths(trial.fullPath)
        await FirebaseService.firestore
            .collection('trials')
            .doc(trial.name)
            .delete()

        // ! This logic should be in a cloud function
        await FirebaseService.storageRef.child(trial.fullPath).delete()
        await FirebaseService.storageRef.child(smallPath).delete()
        await FirebaseService.storageRef.child(mediumPath).delete()
    }

    return (
        <Grid item xs={12} md={6} lg={4} xl={3} key={trial.name}>
            <Grow in={dataUrls ? true : false} timeout={{ enter: TRANSITION_DURATION * index }}>
                <Card raised>
                    {dataUrls && (
                        <a href={dataUrls.fullDataUrl} rel="noreferrer noopener" target="_blank">
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

                            <IconButton onClick={handleDeleteBtnClick}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </Card>
            </Grow>
        </Grid>
    )
}

export default TrialsCard
