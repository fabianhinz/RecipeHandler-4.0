import { Box, Card, CardMedia, createStyles, Grid, IconButton, makeStyles } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { FC, useEffect, useState } from 'react'

import { FirebaseService } from '../../../../firebase'
import { getRefPaths } from '../../../../hooks/useAttachementRef'
import { Trial } from '../../../../model/model'
import { useFirebaseAuthContext } from '../../../Provider/FirebaseAuthProvider'
import { Comments } from '../../../Shared/Comments/Comments'
import { HeaderDispatch } from '../HeaderReducer'

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
    })
)

interface HeaderTrialsCardProps extends HeaderDispatch {
    trial: Trial
}

export const HeaderTrialsCard: FC<HeaderTrialsCardProps> = ({ trial }) => {
    const [fullDataUrl, setFullDataUrl] = useState<string | null>()
    const classes = useStyles()

    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        FirebaseService.storageRef
            .child(trial.fullPath)
            .getDownloadURL()
            .then(url => setFullDataUrl(url))
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
        <Grid item xs={12} md={6} key={trial.name}>
            <Card raised>
                {fullDataUrl ? (
                    <a href={fullDataUrl} rel="noreferrer noopener" target="_blank">
                        <CardMedia image={fullDataUrl} className={classes.img} />
                    </a>
                ) : (
                    <Skeleton height={200} width="100%" />
                )}
                {user && (
                    <Box display="flex" justifyContent="space-evenly">
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
        </Grid>
    )
}
