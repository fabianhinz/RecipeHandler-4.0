import { Avatar, Chip, Grid } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'

import { useAttachmentDropzone } from '../../../hooks/useAttachmentDropzone'
import { User } from '../../../model/model'
import AccountUserChangelog from './AccountUserChangelog'

interface Props {
    user: User
    userDoc: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
}

const AccountUserHeader = ({ userDoc, user }: Props) => {
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
                enqueueSnackbar('Maximale Größe überschritten (500kb)', { variant: 'warning' })
            } else {
                userDoc.update({ profilePicture: dataUrl })
            }
        }
    }, [dropzoneAttachments, enqueueSnackbar, userDoc])

    return (
        <>
            <Grid container spacing={1}>
                <Grid item {...dropzoneProps.getRootProps()}>
                    <Chip
                        avatar={<Avatar src={user.profilePicture} />}
                        onClick={() => null}
                        label={user.username}
                    />
                </Grid>

                <Grid item>
                    <AccountUserChangelog />
                </Grid>
            </Grid>
            <input {...dropzoneProps.getInputProps()} />
        </>
    )
}

export default AccountUserHeader
