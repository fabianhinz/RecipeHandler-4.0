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
import { getFileExtension, getRefPaths } from '../../../../hooks/useAttachementRef'
import { Trial } from '../../../../model/model'
import { useRouterContext } from '../../../Provider/RouterProvider'
import { PATHS } from '../../../Routes/Routes'
import { HeaderDispatch } from '../HeaderReducer'

const useStyles = makeStyles(theme =>
    createStyles({
        cardMedia: {
            width: '100%',
            height: '100vh',
        },
        card: {
            boxShadow: 'unset',
            height: '100%',
            cursor: 'move',
        },
    })
)

interface HeaderTrialsCardProps extends HeaderDispatch {
    trial: Trial
    onTrialDeleted: () => void
}

export const HeaderTrialsCard: FC<HeaderTrialsCardProps> = ({
    trial,
    onTrialDeleted,
    dispatch,
}) => {
    const [dataUrl, setDataUrl] = useState<string | null>()
    const classes = useStyles()

    const potentialRecipe = trial.name.replace(`.${getFileExtension(trial.name)}`, '')

    const { history } = useRouterContext()

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

    const handleStarsBtnClick = () => {
        dispatch({ type: 'trialsChange' })
        history.push(PATHS.recipeEdit(potentialRecipe), {
            recipe: { name: potentialRecipe },
        })
    }
    return (
        <Card className={classes.card} key={trial.name}>
            <CardHeader
                title={potentialRecipe}
                subheader={FirebaseService.createDateFromTimestamp(
                    trial.createdDate
                ).toLocaleDateString()}
                action={
                    <>
                        <IconButton onClick={handleStarsBtnClick}>
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
