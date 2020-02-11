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
    useTheme,
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

const AttachmentUpload = ({
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