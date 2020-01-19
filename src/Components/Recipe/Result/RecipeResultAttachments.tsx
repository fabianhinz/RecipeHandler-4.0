import { Avatar, CardActionArea, createStyles, Grid, makeStyles } from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import { Skeleton } from '@material-ui/lab'
import React, { useRef } from 'react'

import { useAttachmentRef } from '../../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../../model/model'
import { isMetadata } from '../../../model/modelUtil'
import elementIdService from '../../../services/elementIdService'
import { useAnimationContext } from '../../Provider/AnimationProvider'

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
            width: 200,
            height: 200,
            borderRadius: '50%',
        },
        addAvatar: {
            width: 200,
            height: 200,
            fontSize: theme.typography.pxToRem(100),
            backgroundColor:
                theme.palette.type === 'dark'
                    ? 'rgba(117, 117, 117, 0.75)'
                    : 'rgb(189, 189, 189, 0.75)',
        },
    })
)

interface AttachmentPreviewProps {
    attachment: AttachmentMetadata | AttachmentData
}

const AttachmentPreview = ({ attachment }: AttachmentPreviewProps) => {
    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { handleAnimation } = useAnimationContext()
    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)
    const classes = useStyles()

    return (
        <Grid item>
            {attachmentRefLoading ? (
                <Skeleton variant="circle" className={classes.attachmentPreview} />
            ) : (
                <CardActionArea
                    onClick={() => handleAnimation(originIdRef.current)}
                    className={classes.actionArea}>
                    <Avatar
                        id={originIdRef.current}
                        variant="circle"
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
                    {/* Not ready */}
                    {/* <Grid item>
                        <CardActionArea className={classes.actionArea}>
                            <Avatar className={classes.addAvatar}>+</Avatar>
                        </CardActionArea>
                    </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default RecipeResultAttachments
