import { Avatar, CardActionArea, Grid, makeStyles, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { useAttachmentDropzone } from '../../../hooks/useAttachmentDropzone'
import { accountHooks } from '../helper/accountHooks'
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

const AccountUserHeader = () => {
  const classes = useStyles()

  const snackbar = useSnackbar()
  const attachmentDropzone = useAttachmentDropzone({
    attachmentMaxWidth: 1280,
    attachmentMaxSize: 0.5,
    attachmentLimit: 1,
  })

  const authenticatedUser = accountHooks.useAuthenticatedUser()
  const userDoc = accountHooks.useUserDoc()

  useEffect(() => {
    if (attachmentDropzone.dropzoneAttachments.length > 0) {
      const { dataUrl, size } = attachmentDropzone.dropzoneAttachments[0]

      if (size > 500000) {
        snackbar.enqueueSnackbar('Maximale Größe überschritten (500kb)', { variant: 'warning' })
      } else {
        userDoc.update({ profilePicture: dataUrl })
      }
    }
  }, [attachmentDropzone.dropzoneAttachments, snackbar, userDoc])

  return (
    <>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <CardActionArea {...attachmentDropzone.dropzoneProps.getRootProps()}>
            <Avatar
              variant="rounded"
              className={classes.userAvatar}
              src={authenticatedUser.profilePicture}
            />
          </CardActionArea>
        </Grid>

        <Grid item>
          <Typography gutterBottom variant="h4">
            {authenticatedUser.username}
          </Typography>
          <AccountUserChangelog />
        </Grid>
      </Grid>

      <input {...attachmentDropzone.dropzoneProps.getInputProps()} />
    </>
  )
}

export default AccountUserHeader
