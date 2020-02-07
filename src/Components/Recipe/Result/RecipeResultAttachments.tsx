import {
    Avatar,
    Card,
    CardActionArea,
    CircularProgress,
    Collapse,
    createStyles,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Slide,
    useTheme,
    Zoom,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import CheckIcon from '@material-ui/icons/Check'
import { Skeleton } from '@material-ui/lab'
import { CloudUpload } from 'mdi-material-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useAttachmentRef } from '../../../hooks/useAttachmentRef'
import { AttachmentData, AttachmentMetadata } from '../../../model/model'
import { isMetadata } from '../../../model/modelUtil'
import elementIdService from '../../../services/elementIdService'
import { FirebaseService } from '../../../services/firebase'
import { BORDER_RADIUS } from '../../../theme'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useSwipeableAttachmentContext } from '../../Provider/SwipeableAttachmentProvider'
import { useAttachmentDropzone } from '../Create/Attachments/useAttachmentDropzone'

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
        attachmentUploadAvatar: {
            position: 'relative',
        },
        attachmentUploadProgress: {
            position: 'absolute',
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
                </CardActionArea>
            )}
        </Grid>
    )
}

interface AttachmentUploadProps {
    recipeName: string
    attachment: AttachmentData
    onUploadComplete: (recipeName: string) => void
}

const AttachmentUpload = ({ attachment, onUploadComplete, recipeName }: AttachmentUploadProps) => {
    const [uploading, setUploading] = useState(true)
    const { user } = useFirebaseAuthContext()

    const classes = useStyles()

    useEffect(() => {
        const docRef = FirebaseService.firestore
            .collection('recipes')
            .doc(recipeName)
            .collection('attachments')
            .doc()

        FirebaseService.storageRef
            .child(`recipes/${recipeName}/${user?.uid}/${docRef.id}/${attachment.name}`)
            .putString(attachment.dataUrl, 'data_url', { cacheControl: 'public, max-age=31536000' })
            .then(snapshot => {
                const { fullPath, size, name } = snapshot.metadata
                docRef.set({ fullPath, size, name, editorUid: user?.uid }).then(() => {
                    setUploading(false)
                    setTimeout(() => onUploadComplete(attachment.name), 2000)
                })
            })
    }, [attachment, onUploadComplete, recipeName, user])

    if (!user) return <></>

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar className={classes.attachmentUploadAvatar}>
                    {uploading ? <CloudUpload /> : <CheckIcon />}
                    {uploading && (
                        <CircularProgress
                            disableShrink
                            className={classes.attachmentUploadProgress}
                            size={40}
                            thickness={5}
                        />
                    )}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={attachment.name}
                secondary={`${(attachment.size / 1000).toFixed(0)} KB`}
            />
        </ListItem>
    )
}

interface UploadContainerProps {
    recipeName: string
    dropzoneAttachments: AttachmentData[]
    dropzoneAlert: JSX.Element | undefined
}

const UploadContainer = ({
    dropzoneAttachments,
    dropzoneAlert,
    recipeName,
}: UploadContainerProps) => {
    const [uploads, setUploads] = useState<Map<string, AttachmentData>>(new Map())
    const theme = useTheme()

    useEffect(() => {
        if (dropzoneAttachments.length === 0) return

        setUploads(previous => {
            for (const attachment of dropzoneAttachments) {
                if (!previous.get(attachment.name)) previous.set(attachment.name, attachment)
            }
            return new Map(previous)
        })
    }, [dropzoneAttachments, setUploads])

    const handleUploadComplete = useCallback((recipeName: string) => {
        setUploads(previous => {
            if (previous.has(recipeName)) previous.delete(recipeName)
            return new Map(previous)
        })
    }, [])

    return (
        <Slide in={Boolean(dropzoneAlert || dropzoneAttachments.length > 0)} direction="left">
            <Card
                style={{ position: 'fixed', top: 24, right: 24, zIndex: theme.zIndex.modal }}
                elevation={8}>
                {uploads.size > 0 && (
                    <List>
                        {[...uploads.values()].map(attachment => (
                            <AttachmentUpload
                                recipeName={recipeName}
                                attachment={attachment}
                                onUploadComplete={handleUploadComplete}
                                key={attachment.name}
                            />
                        ))}
                    </List>
                )}
                <Collapse in={Boolean(dropzoneAlert)}>{dropzoneAlert}</Collapse>
            </Card>
        </Slide>
    )
}

interface RecipeResultAttachmentsProps {
    recipeName: string
    attachments: (AttachmentMetadata | AttachmentData)[]
}

const RecipeResultAttachments = ({ attachments, recipeName }: RecipeResultAttachmentsProps) => {
    const classes = useStyles()
    const { handleAnimation } = useSwipeableAttachmentContext()
    const { user } = useFirebaseAuthContext()
    const {
        attachments: dropzoneAttachments,
        dropzoneProps,
        attachmentAlert,
    } = useAttachmentDropzone({
        currentAttachments: attachments,
        attachmentMaxWidth: 3840,
        attachmentLimit: 5,
    })

    const handlePreviewClick = (originId: string, activeAttachment: number) =>
        handleAnimation(originId, attachments, activeAttachment)

    return (
        <>
            <Grid wrap="nowrap" className={classes.attachmentPreviewGrid} container spacing={3}>
                {user && (
                    <Zoom in>
                        <Grid item>
                            <CardActionArea
                                className={classes.actionArea}
                                {...dropzoneProps.getRootProps()}>
                                <Avatar className={classes.addAvatar}>+</Avatar>
                                <input {...dropzoneProps.getInputProps()} />
                            </CardActionArea>
                        </Grid>
                    </Zoom>
                )}
                {attachments?.map((attachment, index) => (
                    <AttachmentPreview
                        onClick={originId => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        key={attachment.name}
                    />
                ))}
            </Grid>
            <UploadContainer
                recipeName={recipeName}
                dropzoneAttachments={dropzoneAttachments}
                dropzoneAlert={attachmentAlert}
            />
        </>
    )
}

export default RecipeResultAttachments
