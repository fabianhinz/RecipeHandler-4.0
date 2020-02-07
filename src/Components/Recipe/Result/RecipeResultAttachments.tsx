import {
    Avatar,
    Card,
    CardActionArea,
    CircularProgress,
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
import clsx from 'clsx'
import { CloudUpload, HeartBroken } from 'mdi-material-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Prompt } from 'react-router-dom'

import { useAttachment } from '../../../hooks/useAttachment'
import { AttachmentDoc, DataUrl } from '../../../model/model'
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
            transition: theme.transitions.create('all', {
                duration: theme.transitions.duration.standard,
            }),
        },
        attachmentUploadProgress: {
            position: 'absolute',
        },
        attachmentUploadDone: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
        attachmentUploadError: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
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

interface AttachmentUploadProps {
    recipeName: string
    attachment: AttachmentDoc & DataUrl
    onUploadComplete: (recipeName: string) => void
}

const AttachmentUpload = ({ attachment, onUploadComplete, recipeName }: AttachmentUploadProps) => {
    const [uploading, setUploading] = useState(true)
    const [error, setError] = useState(false)

    const { user } = useFirebaseAuthContext()

    const classes = useStyles()

    useEffect(() => {
        let mounted = true

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
                docRef
                    .set({
                        fullPath,
                        size,
                        name,
                        editorUid: user?.uid,
                        createdDate: attachment.createdDate,
                    } as AttachmentDoc)
                    .then(() => {
                        setUploading(false)
                        setTimeout(() => {
                            if (mounted) onUploadComplete(attachment.name)
                        }, 4000)
                    })
                    .catch(() => {
                        setError(true)
                    })
            })

        return () => {
            mounted = false
        }
    }, [attachment, onUploadComplete, recipeName, user])

    if (!user) return <></>

    return (
        <>
            <ListItem>
                <ListItemAvatar>
                    <Avatar
                        className={clsx(
                            classes.attachmentUploadAvatar,
                            !uploading && classes.attachmentUploadDone,
                            error && classes.attachmentUploadError
                        )}>
                        {uploading ? error ? <HeartBroken /> : <CloudUpload /> : <CheckIcon />}
                        {uploading && !error && (
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

            <Prompt
                when={uploading}
                message="Bilder noch nicht vollständig hochgeladen. Trotzdem die Seite verlassen?"
            />
        </>
    )
}

interface UploadContainerProps {
    recipeName: string
    dropzoneAttachments: (AttachmentDoc & DataUrl)[]
    dropzoneAlert: JSX.Element | undefined
}

const UploadContainer = ({
    dropzoneAttachments,
    dropzoneAlert,
    recipeName,
}: UploadContainerProps) => {
    const [uploads, setUploads] = useState<Map<string, AttachmentDoc & DataUrl>>(new Map())
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
                {dropzoneAlert}
            </Card>
        </Slide>
    )
}

interface RecipeResultAttachmentsProps {
    recipeName: string
}

const RecipeResultAttachments = ({ recipeName }: RecipeResultAttachmentsProps) => {
    const [savedAttachments, setSavedAttachments] = useState<AttachmentDoc[]>([])

    const classes = useStyles()

    const { handleAnimation } = useSwipeableAttachmentContext()
    const { user } = useFirebaseAuthContext()
    const { dropzoneAttachments, dropzoneProps, dropzoneAlert } = useAttachmentDropzone({
        attachmentMaxWidth: 3840,
        attachmentLimit: 5,
    })

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('recipes')
                .doc(recipeName)
                .collection('attachments')
                .orderBy('createdDate', 'desc')
                .onSnapshot(querySnapshot =>
                    setSavedAttachments(
                        querySnapshot.docs.map(
                            doc => ({ ...doc.data(), docPath: doc.ref.path } as AttachmentDoc)
                        )
                    )
                ),
        [recipeName]
    )

    const handlePreviewClick = (originId: string, activeAttachment: number) =>
        handleAnimation(originId, savedAttachments, activeAttachment)

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
                {savedAttachments.map((attachment, index) => (
                    <AttachmentPreview
                        onClick={originId => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        key={attachment.docPath}
                    />
                ))}
            </Grid>
            <UploadContainer
                recipeName={recipeName}
                dropzoneAttachments={dropzoneAttachments}
                dropzoneAlert={dropzoneAlert}
            />
        </>
    )
}

export default RecipeResultAttachments
