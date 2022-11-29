import {
  Avatar,
  CardActionArea,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { useAttachmentDropzone } from '@/hooks/useAttachmentDropzone'
import { User } from '@/model/model'

import AccountUserChangelog from './AccountUserChangelog'

const useStyles = makeStyles(theme => ({
  userAvatar: {
    [theme.breakpoints.between('xs', 'md')]: {
      height: 100,
      width: 100,
    },
    [theme.breakpoints.up('lg')]: {
      height: 120,
      width: 120,
    },
    [theme.breakpoints.up('xl')]: {
      height: 140,
      width: 140,
    },
  },
}))

interface Props {
  user: User
  userDoc: firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>
}

const AccountUserHeader = ({ userDoc, user }: Props) => {
  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()
  const { dropzoneAttachments, dropzoneProps } = useAttachmentDropzone({
    attachmentMaxWidth: 1280,
    attachmentMaxSize: 0.5,
    attachmentLimit: 1,
  })

  useEffect(() => {
    if (dropzoneAttachments.length > 0) {
      const { dataUrl, size } = dropzoneAttachments[0]

      if (size > 500000) {
        enqueueSnackbar('Maximale Größe überschritten (500kb)', {
          variant: 'warning',
        })
      } else {
        userDoc.update({ profilePicture: dataUrl })
      }
    }
  }, [dropzoneAttachments, enqueueSnackbar, userDoc])

  return (
    <>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <CardActionArea {...dropzoneProps.getRootProps()}>
            <Avatar
              variant="rounded"
              className={classes.userAvatar}
              src={user.profilePicture}
            />
          </CardActionArea>
        </Grid>

        <Grid item>
          <Typography gutterBottom variant="h4">
            {user.username}
          </Typography>
          <AccountUserChangelog />
        </Grid>
      </Grid>

      <input {...dropzoneProps.getInputProps()} />
    </>
  )
}

export default AccountUserHeader
