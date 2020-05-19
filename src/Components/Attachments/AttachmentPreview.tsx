import { createStyles, Fab, Grid, makeStyles, Tooltip, Zoom } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { FileImage } from 'mdi-material-ui'
import React, { useRef, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import useImgSrcLazy from '../../hooks/useImgSrcLazy'
import { AttachmentDoc } from '../../model/model'
import elementIdService from '../../services/elementIdService'
import { BORDER_RADIUS } from '../../theme'

type StyleProps = Pick<Props, 'itemHeight'>

const useStyles = makeStyles(theme => {
    const height = ({ itemHeight }: StyleProps) => itemHeight - theme.spacing(4)

    return createStyles({
        skeleton: {
            borderRadius: BORDER_RADIUS,
            width: 500,
            height,
        },
        img: {
            borderRadius: BORDER_RADIUS,
            boxShadow: theme.shadows[1],
            cursor: 'pointer',
            height,
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
})

interface Props {
    attachment: AttachmentDoc
    onClick: (originId: string) => void
    previewAttachment: string | undefined
    previewChangeDisabled?: boolean
    onPreviewAttachmentChange: (smallDataUrl: string | undefined) => void
    itemHeight: number
}

const AttachmentPreview = ({
    attachment,
    onClick,
    previewAttachment,
    onPreviewAttachmentChange,
    previewChangeDisabled,
    itemHeight,
}: Props) => {
    const [showSelection, setShowSelection] = useState(false)

    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { attachmentRef } = useAttachment(attachment)
    const { imgLoading, imgSrc } = useImgSrcLazy({ src: attachmentRef.mediumDataUrl })
    const classes = useStyles({ itemHeight })

    return (
        <Grid
            item
            className={classes.gridItem}
            onMouseEnter={() => setShowSelection(true)}
            onMouseLeave={() => setShowSelection(false)}>
            {imgLoading ? (
                <Skeleton variant="rect" animation="wave" className={classes.skeleton} />
            ) : (
                <>
                    <img
                        onClick={() => onClick(originIdRef.current)}
                        className={classes.img}
                        alt=""
                        id={originIdRef.current}
                        src={imgSrc}
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
