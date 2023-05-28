import {
  Avatar,
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check'
import clsx from 'clsx'
import { FirebaseError } from 'firebase/app'
import { setDoc } from 'firebase/firestore'
import { ref, uploadString } from 'firebase/storage'
import { CloudUpload, HeartBroken } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { Prompt } from 'react-router-dom'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { storage } from '@/firebase/firebaseConfig'
import { resolveDoc } from '@/firebase/firebaseQueries'
import { AttachmentDoc, DataUrl } from '@/model/model'

const useStyles = makeStyles(theme => ({
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
    bottom: 'calc(env(safe-area-inset-bottom) + 24px)',
    [theme.breakpoints.only('xs')]: {
      right: 16,
    },
    [theme.breakpoints.up('sm')]: {
      right: 24,
    },
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[4],
  },
  attachmentName: {
    [theme.breakpoints.only('xs')]: {
      maxWidth: '50vw',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '25vw',
    },
  },
}))

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
  const { enqueueSnackbar } = useSnackbar()

  const classes = useStyles()

  useEffect(() => {
    let mounted = true

    const docRef = resolveDoc(
      `recipes/${recipeName}/attachments`,
      undefined,
      true
    )
    const storageRef = ref(
      storage,
      `recipes/${recipeName}/${user?.uid}/${docRef.id}/${attachment.name}`
    )

    uploadString(storageRef, attachment.dataUrl, 'data_url', {
      cacheControl: 'public, max-age=31536000',
    })
      .then(snapshot => {
        const { fullPath, size, name } = snapshot.metadata
        setDoc(docRef, {
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
      .catch((e: FirebaseError) => {
        if (e.code === 'storage/unauthorized') {
          enqueueSnackbar('fehlende Berechtigungen', { variant: 'error' })
          onUploadComplete(attachment.name)
        }
      })

    return () => {
      mounted = false
    }
  }, [attachment, enqueueSnackbar, onUploadComplete, recipeName, user])

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
            {uploading ? (
              error ? (
                <HeartBroken />
              ) : (
                <CloudUpload />
              )
            ) : (
              <CheckIcon />
            )}
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

// eslint-disable-next-line react/no-multi-comp
const AttachmentUpload = ({
  dropzoneAttachments,
  dropzoneAlert,
  recipeName,
}: UploadContainerProps) => {
  const [uploads, setUploads] = useState<Map<string, AttachmentDoc & DataUrl>>(
    new Map()
  )
  const classes = useStyles()

  useEffect(() => {
    if (dropzoneAttachments.length === 0) return

    setUploads(previous => {
      for (const attachment of dropzoneAttachments) {
        if (!previous.get(attachment.name))
          previous.set(attachment.name, attachment)
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
    <Slide
      in={Boolean(dropzoneAlert || dropzoneAttachments.length > 0)}
      direction="left">
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
