import {
    Avatar,
    Card,
    CardContent,
    Chip,
    createStyles,
    Divider,
    Grid,
    Grow,
    IconButton,
    InputBase,
    makeStyles,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { FC, memo, useState } from 'react'

import { getFileExtension, useAttachmentRef } from '../../../../hooks/useAttachmentRef'
import { TRANSITION_DURATION, useTransition } from '../../../../hooks/useTransition'
import { AttachmentData, AttachmentMetadata } from '../../../../model/model'
import { isData, isMetadata } from '../../../../model/modelUtil'

const useStyles = makeStyles(theme => {
    return createStyles({
        attachment: {
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
export interface AttachmentsCardChangeHandler {
    onDeleteAttachment: (name: string, fullPath: string) => void
    onRemoveAttachment: (attachmentName: string) => void
    onSaveAttachment: (name: { old: string; new: string }) => void
}

interface RecipeCreateAttachmentsCardProps extends AttachmentsCardChangeHandler {
    attachment: AttachmentData | AttachmentMetadata
}

const RecipeCreateAttachmentsCard: FC<RecipeCreateAttachmentsCardProps> = ({
    attachment,
    onRemoveAttachment,
    onDeleteAttachment,
    onSaveAttachment,
}) => {
    const [name, setName] = useState<string>(attachment.name)
    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)
    const { transition, transitionChange } = useTransition()
    const classes = useStyles()

    const handleDeleteClick = async () => {
        await transitionChange()
        if (isMetadata(attachment)) onDeleteAttachment(attachment.name, attachment.fullPath)
        else onRemoveAttachment(attachment.name)
    }

    const handleSaveClick = () =>
        onSaveAttachment({
            old: attachment.name,
            new: `${name}.${getFileExtension(attachment.name)}`,
        })

    return (
        <Grid item>
            <Grow in={transition} mountOnEnter timeout={TRANSITION_DURATION}>
                <Card onClick={e => e.stopPropagation()}>
                    <CardContent>
                        <Chip label={`${(attachment.size / 1000000).toFixed(1)} MB`} />

                        {attachmentRefLoading ? (
                            <Skeleton variant="circle" className={classes.attachment} />
                        ) : isMetadata(attachment) ? (
                            <Avatar
                                className={classes.attachment}
                                src={attachmentRef.mediumDataUrl}>
                                <BugIcon fontSize="large" />
                            </Avatar>
                        ) : (
                            <Avatar className={classes.attachment} src={attachment.dataUrl} />
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
                                disabled={attachment.name === name || name.length === 0}
                                onClick={handleSaveClick}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </CardContent>
                </Card>
            </Grow>
        </Grid>
    )
}

export default memo(RecipeCreateAttachmentsCard, (prev, next) => {
    let sameAttachment = true
    if (isData(prev.attachment) && isData(next.attachment)) {
        sameAttachment = prev.attachment.dataUrl === next.attachment.dataUrl
    }
    if (isMetadata(prev.attachment) && isMetadata(next.attachment)) {
        sameAttachment = prev.attachment.fullPath === next.attachment.fullPath
    }
    return (
        sameAttachment &&
        prev.attachment.name === next.attachment.name &&
        prev.onSaveAttachment === next.onSaveAttachment
    )
})
