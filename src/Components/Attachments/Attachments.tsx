import { Avatar, CardActionArea, createStyles, Grid, makeStyles, Zoom } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { useAttachmentDropzone } from '../../hooks/useAttachmentDropzone'
import { AttachmentDoc } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useSwipeableAttachmentContext } from '../Provider/SwipeableAttachmentProvider'
import AttachmentPreview from './AttachmentPreview'
import AttachmentUpload from './AttachmentUpload'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentsGridContainer: {
            overflowX: 'auto',
            // '&::-webkit-scrollbar': {
            //     display: 'none',
            // },
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
    })
)

interface RecipeResultAttachmentsProps {
    recipeName: string
}

const Attachments = ({ recipeName }: RecipeResultAttachmentsProps) => {
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
                .orderBy('createdDate', 'asc')
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
            <Grid wrap="nowrap" className={classes.attachmentsGridContainer} container spacing={3}>
                {savedAttachments.map((attachment, index) => (
                    <AttachmentPreview
                        onClick={originId => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        key={attachment.docPath}
                    />
                ))}
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
            </Grid>
            <AttachmentUpload
                recipeName={recipeName}
                dropzoneAttachments={dropzoneAttachments}
                dropzoneAlert={dropzoneAlert}
            />
        </>
    )
}

export default Attachments
