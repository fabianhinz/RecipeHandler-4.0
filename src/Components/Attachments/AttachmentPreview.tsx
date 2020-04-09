import { createStyles, Fab, Grid, makeStyles, Tooltip, Zoom } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { FileImage } from 'mdi-material-ui'
import React, { useRef, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc } from '../../model/model'
import elementIdService from '../../services/elementIdService'
import { BORDER_RADIUS } from '../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        skeleton: {
            borderRadius: BORDER_RADIUS,

            [theme.breakpoints.between('xs', 'sm')]: {
                height: 250,
                width: 250,
            },
            [theme.breakpoints.between('md', 'lg')]: {
                height: 350,
                width: 350,
            },
            [theme.breakpoints.up('xl')]: {
                height: 500,
                width: 500,
            },
        },
        img: {
            borderRadius: BORDER_RADIUS,
            boxShadow: theme.shadows[1],
            cursor: 'pointer',
            [theme.breakpoints.between('xs', 'sm')]: {
                height: 250,
            },
            [theme.breakpoints.between('md', 'lg')]: {
                height: 350,
            },
            [theme.breakpoints.up('xl')]: {
                height: 500,
            },
        },
        gridItem: {
            position: 'relative',
        },
        selectionButton: {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 999,
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
                <Skeleton variant="circle" animation="wave" className={classes.skeleton} />
            ) : (
                <>
                    <img
                        onClick={() => onClick(originIdRef.current)}
                        className={classes.img}
                        alt=""
                        id={originIdRef.current}
                        src={attachmentRef.mediumDataUrl}
                    />

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
