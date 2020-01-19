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
import React, { useRef } from 'react'

import { useAttachmentRef } from '../../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../../model/model'
import { isMetadata } from '../../../model/modelUtil'
import elementIdService from '../../../services/elementIdService'
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
        destinationContainer: {
            zIndex: -1,
            height: 800,
            width: 800,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
        },
    })
)

interface AttachmentPreviewProps {
    attachment: AttachmentMetadata | AttachmentData
}

const AttachmentPreview = ({ attachment }: AttachmentPreviewProps) => {
    const animationRef = useRef<Animation | null>(null)
    const originIdRef = useRef(elementIdService.getId('attachment-origin'))

    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(attachment)
    const classes = useStyles()

    const handleAnimation = () => {
        if (animationRef.current) {
            animationRef.current.reverse()
            animationRef.current = null
        } else initAnimation()
    }

    const initAnimation = () => {
        const origin = document.getElementById(originIdRef.current)
        const destination = document.getElementById('destination')

        if (!origin || !destination) return

        const originRect = origin.getBoundingClientRect()
        const destinationRect = destination.getBoundingClientRect()

        const keyframes: Keyframe[] = [
            {
                top: `${originRect.top}px`,
                left: `${originRect.left}px`,
                position: 'fixed',
                transform: `
                    translate(0px,0px)
                    scale(1,1)
                `,
                borderRadius: '50%',
                zIndex: 1,
            },
            {
                transform: `
                    translate(-50%,-50%)
                    scale(${destinationRect.width / originRect.width},${destinationRect.height /
                    originRect.height})
                `,
                position: 'fixed',
                top: '50%',
                left: '50%',
                borderRadius: '10%',
                zIndex: 1,
            },
        ]

        const options: KeyframeAnimationOptions = {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'forwards',
        }

        animationRef.current = origin.animate(keyframes, options)
    }

    return (
        <>
            <Grid item>
                {attachmentRefLoading ? (
                    <Skeleton variant="circle" className={classes.attachmentPreview} />
                ) : (
                    <CardActionArea
                        onClick={() => {
                            handleAnimation()
                        }}
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

            <div id="destination" className={classes.destinationContainer} />
        </>
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
