import {
    Card,
    CardHeader,
    CardMedia,
    createStyles,
    IconButton,
    makeStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import StarsIcon from '@material-ui/icons/StarsTwoTone'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { FC, useEffect, useState } from 'react'

import { FirebaseService } from '../../../../firebase'
import { getRefPaths } from '../../../../hooks/useAttachementRef'
import { Trial } from '../../../../model/model'

const useStyles = makeStyles(theme =>
    createStyles({
        cardMedia: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
        card: {
            boxShadow: 'unset',
            height: '100%',
        },
    })
)

interface HeaderTrialsCardProps {
    trial: Trial
    onTrialDeleted: () => void
}

export const HeaderTrialsCard: FC<HeaderTrialsCardProps> = ({ trial, onTrialDeleted }) => {
    const [dataUrl, setDataUrl] = useState<string | null>()
    const classes = useStyles()

    useEffect(() => {
        FirebaseService.storageRef
            .child(trial.fullPath)
            .getDownloadURL()
            .then(url => setDataUrl(url))
    }, [trial.fullPath])

    const handleDeleteBtnClick = async () => {
        onTrialDeleted()

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
        <Card className={classes.card} key={trial.name}>
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
                        <IconButton onClick={handleDeleteBtnClick}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                }
            />
            {dataUrl ? (
                <CardMedia className={classes.cardMedia} image={dataUrl} />
            ) : (
                <Skeleton height="100%" />
            )}
        </Card>
    )
}
