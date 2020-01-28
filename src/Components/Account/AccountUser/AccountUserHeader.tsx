import {
    Avatar,
    Button,
    CardActionArea,
    createStyles,
    Divider,
    Grid,
    makeStyles,
    Typography,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/InfoRounded'
import { CameraImage } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'

import { User } from '../../../model/model'
import { useAttachmentDropzone } from '../../Recipe/Create/Attachments/useAttachmentDropzone'
import AccountUserChangelog from './AccountUserChangelog'

const useStyles = makeStyles(theme =>
    createStyles({
        gridContainerAccount: {
            [theme.breakpoints.up('lg')]: {
                marginBottom: theme.spacing(1),
            },
        },
        avatar: {
            width: 220,
            height: 220,
        },
        actionArea: {
            borderRadius: '50%',
            width: 'fit-content',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    })
)

interface Props {
    user: User
    userDoc: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    showInfo: boolean
    onShowInfoChange: () => void
}

const AccountUserHeader = ({ user, userDoc, showInfo, onShowInfoChange }: Props) => {
    const { attachments, dropzoneProps } = useAttachmentDropzone({
        attachmentMaxWidth: 1920,
        attachmentLimit: 1,
    })
    const { enqueueSnackbar } = useSnackbar()

    const classes = useStyles()

    useEffect(() => {
        if (attachments.length > 0) {
            const { dataUrl, size } = attachments[0]
            if (size > 500000) {
                enqueueSnackbar('Maximale Größe überschritten (500kb)', { variant: 'warning' })
            } else {
                userDoc.update({ profilePicture: dataUrl })
            }
        }
    }, [attachments, enqueueSnackbar, userDoc])

    return (
        <Grid className={classes.gridContainerAccount} container spacing={4} justify="center">
            <Grid item xs="auto">
                <CardActionArea className={classes.actionArea} {...dropzoneProps.getRootProps()}>
                    <Avatar className={classes.avatar} src={user.profilePicture}>
                        <CameraImage fontSize="large" />
                    </Avatar>
                    <input {...dropzoneProps.getInputProps()} />
                </CardActionArea>
            </Grid>
            <Grid item xs="auto">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={1} justify="space-between">
                            <Grid item xs="auto">
                                <Typography variant="h5" display="inline">
                                    Willkommen zurück {user.username}
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <AccountUserChangelog />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Button startIcon={<InfoIcon />} onClick={onShowInfoChange}>
                            Informationen {showInfo ? 'ausblenden' : 'einblenden'}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default AccountUserHeader
