import {
    Avatar,
    Card,
    CircularProgress,
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Slide,
    Typography,
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import clsx from 'clsx'
import { CloudUpload, HeartBroken } from 'mdi-material-ui'
import React, { useCallback, useEffect, useState } from 'react'
import { Prompt } from 'react-router-dom'

import { AttachmentDoc, DataUrl } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            position: 'relative',
            transition: theme.transitions.create('all', {
                duration: theme.transitions.duration.standard,
            }),
        },
        progress: {
            position: 'absolute',
        },
        done: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
        error: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
        card: {
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top) + 24px)',
            [theme.breakpoints.only('xs')]: {
                right: 16,
            },
            [theme.breakpoints.up('sm')]: {
                right: 24,
            },
            zIndex: theme.zIndex.modal,
        },
        attachmentName: {
            [theme.breakpoints.only('xs')]: {
                maxWidth: '50vw',
            },
            [theme.breakpoints.up('sm')]: {
                maxWidth: '25vw',
            },
        },
    })
)

interface AttachmentUploadListItemProps {
    recipeName: string
    attachment: AttachmentDoc & DataUrl
    onUploadComplete: (recipeName: string) => void
}

const AttachmentUploadListItem = ({
    attachment,
    onUploadComplete,
    recipeName,
}: AttachmentUploadListItemProps) => {
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
                            classes.avatar,
                            !uploading && classes.done,
                            error && classes.error
                        )}>
                        {uploading ? error ? <HeartBroken /> : <CloudUpload /> : <CheckIcon />}
                        {uploading && !error && (
                            <CircularProgress
                                disableShrink
                                className={classes.progress}
                                size={40}
                                thickness={5}
                            />
                        )}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="h6" className={classes.attachmentName} noWrap>
                            {attachment.name}
                        </Typography>
                    }
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

const AttachmentUpload = ({
    dropzoneAttachments,
    dropzoneAlert,
    recipeName,
}: UploadContainerProps) => {
    const [uploads, setUploads] = useState<Map<string, AttachmentDoc & DataUrl>>(new Map())
    const classes = useStyles()

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
            <Card className={classes.card} elevation={8}>
                {uploads.size > 0 && (
                    <List>
                        {[...uploads.values()].map(attachment => (
                            <AttachmentUploadListItem
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

export default AttachmentUpload
