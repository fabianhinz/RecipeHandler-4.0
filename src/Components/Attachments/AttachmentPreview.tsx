import {
    Avatar,
    CardActionArea,
    createStyles,
    Fab,
    Grid,
    makeStyles,
    Tooltip,
    Zoom,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import { Skeleton } from '@material-ui/lab'
import { FileImage } from 'mdi-material-ui'
import React, { useRef, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc } from '../../model/model'
import elementIdService from '../../services/elementIdService'
import { BORDER_RADIUS } from '../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentPreview: {
            [theme.breakpoints.down('sm')]: {
                width: 320,
                height: 180,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 400,
                height: 225,
            },
            [theme.breakpoints.up('xl')]: {
                width: 498,
                height: 280,
            },
            borderRadius: BORDER_RADIUS,
            boxShadow: theme.shadows[1],
        },
        actionArea: {
            [theme.breakpoints.down('sm')]: {
                width: 320,
                height: 180,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 400,
                height: 225,
            },
            [theme.breakpoints.up('xl')]: {
                width: 498,
                height: 280,
            },
            borderRadius: BORDER_RADIUS,
            transition: theme.transitions.create('border', {
                duration: theme.transitions.duration.standard,
            }),
        },
        gridItem: {
            position: 'relative',
        },
        selectionButton: {
            position: 'absolute',
            top: 0,
            left: 0,
        },
    })
)

interface AttachmentPreviewProps {
    attachment: AttachmentDoc
    onClick: (originId: string) => void
    previewAttachment: string | undefined
    previewChangeDisabled?: boolean
    onPreviewAttachmentChange: (smallDataUrl: string) => void
}

const AttachmentPreview = ({
    attachment,
    onClick,
    previewAttachment,
    onPreviewAttachmentChange,
    previewChangeDisabled,
}: AttachmentPreviewProps) => {
    const [showSelection, setShowSelection] = useState(false)

    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { attachmentRef, attachmentRefLoading } = useAttachment(attachment)
    const classes = useStyles()

    return (
        <Grid
            item
            className={classes.gridItem}
            onMouseEnter={() => setShowSelection(true)}
            onMouseLeave={() => setShowSelection(false)}>
            {attachmentRefLoading ? (
                <Skeleton variant="circle" className={classes.attachmentPreview} />
            ) : (
                <>
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
                    <Zoom in={showSelection && !previewChangeDisabled}>
                        <Tooltip
                            placement="right"
                            title={
                                previewAttachment === attachmentRef.smallDataUrl
                                    ? 'Vorschaubild'
                                    : 'Als Vorschaubild setzen'
                            }>
                            <Fab
                                className={classes.selectionButton}
                                onClick={() =>
                                    onPreviewAttachmentChange(attachmentRef.smallDataUrl)
                                }
                                color={
                                    previewAttachment === attachmentRef.smallDataUrl
                                        ? 'primary'
                                        : 'default'
                                }
                                size="small">
                                <FileImage />
                            </Fab>
                        </Tooltip>
                    </Zoom>
                </>
            )}
        </Grid>
    )
}

export default AttachmentPreview
