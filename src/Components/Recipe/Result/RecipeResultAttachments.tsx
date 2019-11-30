import {
    Avatar,
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    useMediaQuery,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { useAttachmentRef } from '../../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../../model/model'
import { isMetadata } from '../../../model/modelUtil'
import { useSelectedAttachement } from '../../Provider/SelectedAttachementProvider'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentPreviewGrid: {
            overflowX: 'auto',
        },
        attachmentPreview: {
            width: 200,
            height: 200,
            boxShadow: theme.shadows[1],
        },
        actionArea: {
            borderRadius: '50%',
        },
    })
)

interface AttachmentPreviewProps {
    attachment: AttachmentMetadata | AttachmentData
}

const AttachmentPreview = ({ attachment }: AttachmentPreviewProps) => {
    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)
    const { setSelectedAttachment } = useSelectedAttachement()
    const loadHighRes = useMediaQuery('(min-width: 2000px)')
    const classes = useStyles()

    return (
        <Grid item>
            {attachmentRefLoading ? (
                <Skeleton variant="circle" className={classes.attachmentPreview} />
            ) : (
                <CardActionArea
                    onClick={() => {
                        if (isMetadata(attachment))
                            setSelectedAttachment(
                                loadHighRes
                                    ? attachmentRef.fullDataUrl
                                    : attachmentRef.mediumDataUrl
                            )
                        else setSelectedAttachment(attachment.dataUrl)
                    }}
                    className={classes.actionArea}>
                    <Avatar
                        className={classes.attachmentPreview}
                        src={
                            isMetadata(attachment)
                                ? attachmentRef.mediumDataUrl
                                : attachment.dataUrl
                        }>
                        <BugIcon fontSize="large" />
                    </Avatar>
                </CardActionArea>
            )}
        </Grid>
    )
}

interface RecipeResultAttachmentsProps {
    attachments: (AttachmentMetadata | AttachmentData)[]
}

const RecipeResultAttachments = ({ attachments }: RecipeResultAttachmentsProps) => {
    const classes = useStyles()

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Grid
                    wrap="nowrap"
                    className={classes.attachmentPreviewGrid}
                    container
                    spacing={2}
                    justify="flex-start">
                    {attachments.map(attachment => (
                        <AttachmentPreview attachment={attachment} key={attachment.name} />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default RecipeResultAttachments
