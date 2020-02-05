import {
    Avatar,
    CardActionArea,
    Chip,
    createStyles,
    Grid,
    makeStyles,
    Slide,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import { Skeleton } from '@material-ui/lab'
import { Clock } from 'mdi-material-ui'
import React, { useRef } from 'react'

import { useAttachmentRef } from '../../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../../model/model'
import { isMetadata } from '../../../model/modelUtil'
import elementIdService from '../../../services/elementIdService'
import { BORDER_RADIUS } from '../../../theme'
import { useAnimationContext } from '../../Provider/AnimationProvider'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentPreviewGrid: {
            overflowX: 'auto',
            // '&::-webkit-scrollbar': {
            //     display: 'none',
            // },
        },
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
            position: 'relative',
        },
        addAvatar: {
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
            fontSize: theme.typography.pxToRem(100),
            backgroundColor:
                theme.palette.type === 'dark'
                    ? 'rgba(117, 117, 117, 0.75)'
                    : 'rgb(189, 189, 189, 0.75)',
        },
        timeCreatedChip: {
            boxShadow: theme.shadows[8],
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, 0)',
            zIndex: 1,
            top: theme.spacing(0.5),
        },
    })
)

interface AttachmentPreviewProps {
    attachment: AttachmentMetadata | AttachmentData
    onClick: (originId: string) => void
}

const AttachmentPreview = ({ attachment, onClick }: AttachmentPreviewProps) => {
    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)
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
                        src={
                            isMetadata(attachment)
                                ? attachmentRef.mediumDataUrl
                                : attachment.dataUrl
                        }>
                        <BugIcon fontSize="large" />
                    </Avatar>

                    <Chip
                        size="small"
                        icon={<Clock />}
                        label={attachmentRef.timeCreated}
                        className={classes.timeCreatedChip}
                    />
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
    const { handleAnimation } = useAnimationContext()

    const handlePreviewClick = (originId: string, activeAttachment: number) =>
        handleAnimation(originId, attachments, activeAttachment)

    return (
        <Grid wrap="nowrap" className={classes.attachmentPreviewGrid} container spacing={3}>
            <Grid item>
                <CardActionArea className={classes.actionArea}>
                    <Avatar className={classes.addAvatar}>+</Avatar>
                </CardActionArea>
            </Grid>
            {attachments.map((attachment, index) => (
                <AttachmentPreview
                    onClick={originId => handlePreviewClick(originId, index)}
                    attachment={attachment}
                    key={attachment.name}
                />
            ))}
        </Grid>
    )
}

export default RecipeResultAttachments
