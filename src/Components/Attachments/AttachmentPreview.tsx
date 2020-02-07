import { Avatar, CardActionArea, createStyles, Grid, makeStyles } from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import { Skeleton } from '@material-ui/lab'
import React, { useRef } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc } from '../../model/model'
import elementIdService from '../../services/elementIdService'
import { BORDER_RADIUS } from '../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentPreview: {
            [theme.breakpoints.down('sm')]: {
                width: 180,
                height: 180,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 225,
                height: 225,
            },
            [theme.breakpoints.up('xl')]: {
                width: 280,
                height: 280,
            },
            borderRadius: BORDER_RADIUS,
            boxShadow: theme.shadows[1],
        },
        actionArea: {
            [theme.breakpoints.down('sm')]: {
                width: 180,
                height: 180,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 225,
                height: 225,
            },
            [theme.breakpoints.up('xl')]: {
                width: 280,
                height: 280,
            },
            borderRadius: BORDER_RADIUS,
        },
    })
)

interface AttachmentPreviewProps {
    attachment: AttachmentDoc
    onClick: (originId: string) => void
}

const AttachmentPreview = ({ attachment, onClick }: AttachmentPreviewProps) => {
    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { attachmentRef, attachmentRefLoading } = useAttachment(attachment)
    const classes = useStyles()

    return (
        <Grid item>
            {attachmentRefLoading ? (
                <Skeleton variant="circle" className={classes.attachmentPreview} />
            ) : (
                <CardActionArea
                    onClick={() => onClick(originIdRef.current)}
                    className={classes.actionArea}>
                    <Avatar
                        id={originIdRef.current}
                        className={classes.attachmentPreview}
                        src={attachmentRef.mediumDataUrl}>
                        <BugIcon fontSize="large" />
                    </Avatar>
                </CardActionArea>
            )}
        </Grid>
    )
}

export default AttachmentPreview
