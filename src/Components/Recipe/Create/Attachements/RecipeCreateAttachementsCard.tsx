import {
    Avatar,
    Card,
    CardContent,
    Chip,
    createStyles,
    Divider,
    Grid,
    IconButton,
    InputBase,
    makeStyles,
    Zoom,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { FC, memo, useState } from 'react'

import { getFileExtension, useAttachementRef } from '../../../../hooks/useAttachementRef'
import { TRANSITION_DURATION, useTransition } from '../../../../hooks/useTransition'
import { AttachementData, AttachementMetadata } from '../../../../model/model'
import { isData, isMetadata } from '../../../../model/modelUtil'

const useStyles = makeStyles(theme => {
    return createStyles({
        attachement: {
            width: 200,
            height: 200,
            boxShadow: theme.shadows[1],
        },
        actions: {
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        divider: {
            margin: `${theme.spacing(2)}px 0px`,
        },
    })
})
export interface AttachementsCardChangeHandler {
    onDeleteAttachement: (name: string, fullPath: string) => void
    onRemoveAttachement: (attachementName: string) => void
    onSaveAttachement: (name: { old: string; new: string }) => void
}

interface RecipeCreateAttachementsCardProps extends AttachementsCardChangeHandler {
    attachement: AttachementData | AttachementMetadata
}

const RecipeCreateAttachementsCard: FC<RecipeCreateAttachementsCardProps> = ({
    attachement,
    onRemoveAttachement,
    onDeleteAttachement,
    onSaveAttachement,
}) => {
    const [name, setName] = useState<string>(attachement.name)
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)
    const { transition, transitionChange } = useTransition()
    const classes = useStyles()

    const handleDeleteClick = async () => {
        await transitionChange()
        if (isMetadata(attachement)) onDeleteAttachement(attachement.name, attachement.fullPath)
        else onRemoveAttachement(attachement.name)
    }

    const handleSaveClick = () =>
        onSaveAttachement({
            old: attachement.name,
            new: `${name}.${getFileExtension(attachement.name)}`,
        })

    return (
        <Grid item>
            <Zoom in={transition} mountOnEnter timeout={TRANSITION_DURATION}>
                <Card onClick={e => e.stopPropagation()}>
                    <CardContent>
                        <Chip label={`${(attachement.size / 1000000).toFixed(1)} MB`} />

                        {attachementRefLoading ? (
                            <Skeleton variant="circle" className={classes.attachement} />
                        ) : isMetadata(attachement) ? (
                            <Avatar
                                className={classes.attachement}
                                src={attachementRef.mediumDataUrl}>
                                <BugIcon fontSize="large" />
                            </Avatar>
                        ) : (
                            <Avatar className={classes.attachement} src={attachement.dataUrl} />
                        )}

                        <Divider className={classes.divider} />

                        <InputBase
                            margin="dense"
                            fullWidth
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />

                        <div className={classes.actions}>
                            <IconButton
                                disabled={attachement.name === name || name.length === 0}
                                onClick={handleSaveClick}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </CardContent>
                </Card>
            </Zoom>
        </Grid>
    )
}

export default memo(RecipeCreateAttachementsCard, (prev, next) => {
    let sameAttachement = true
    if (isData(prev.attachement) && isData(next.attachement)) {
        sameAttachement = prev.attachement.dataUrl === next.attachement.dataUrl
    }
    if (isMetadata(prev.attachement) && isMetadata(next.attachement)) {
        sameAttachement = prev.attachement.fullPath === next.attachement.fullPath
    }
    return (
        sameAttachement &&
        prev.attachement.name === next.attachement.name &&
        prev.onSaveAttachement === next.onSaveAttachement
    )
})
