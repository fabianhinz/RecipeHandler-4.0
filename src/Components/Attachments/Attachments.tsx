import { Avatar, CardActionArea, createStyles, Grid, makeStyles } from '@material-ui/core'
import { CloudUploadOutline } from 'mdi-material-ui'
import React, { useEffect, useMemo, useState } from 'react'

import { useAttachmentDropzone } from '../../hooks/useAttachmentDropzone'
import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { useAttachmentGalleryContext } from '../Provider/AttachmentGalleryProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import AttachmentPreview from './AttachmentPreview'
import AttachmentUpload from './AttachmentUpload'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentsGridContainer: {
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        addAvatar: {
            [theme.breakpoints.down('sm')]: {
                width: 90,
                height: 180,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 112.5,
                height: 225,
            },
            [theme.breakpoints.up('xl')]: {
                width: 140,
                height: 280,
            },
            borderRadius: BORDER_RADIUS,
        },
        addIcon: {
            fontSize: theme.typography.pxToRem(60),
        },
    })
)

interface RecipeResultAttachmentsProps {
    recipeName: string
}

const Attachments = ({ recipeName }: RecipeResultAttachmentsProps) => {
    const [savedAttachments, setSavedAttachments] = useState<AttachmentDoc[]>([])
    const [recipePreview, setRecipePreview] = useState<
        { smallDataUrl?: string; disabled: boolean } | undefined
    >()

    const classes = useStyles()

    const { handleAnimation } = useAttachmentGalleryContext()
    const { user } = useFirebaseAuthContext()
    const { dropzoneAttachments, dropzoneProps, dropzoneAlert } = useAttachmentDropzone({
        attachmentMaxWidth: 3840,
        attachmentLimit: 5,
    })

    const recipeDocRef = useMemo(
        () => FirebaseService.firestore.collection('recipes').doc(recipeName),
        [recipeName]
    )

    useEffect(
        () =>
            recipeDocRef
                .collection('attachments')
                .orderBy('createdDate', 'asc')
                .onSnapshot(querySnapshot =>
                    setSavedAttachments(
                        querySnapshot.docs.map(
                            doc => ({ ...doc.data(), docPath: doc.ref.path } as AttachmentDoc)
                        )
                    )
                ),
        [recipeDocRef, recipeName]
    )

    useEffect(
        () =>
            recipeDocRef.onSnapshot(querySnapshot => {
                const data = querySnapshot.data() as Recipe | undefined
                if (!data) return
                setRecipePreview({
                    smallDataUrl: data.previewAttachment,
                    disabled: !user || (user.uid !== data.editorUid && !user.admin),
                })
            }),
        [recipeDocRef, recipeName, user]
    )

    const handlePreviewClick = (originId: string, activeAttachment: number) =>
        handleAnimation(originId, savedAttachments, activeAttachment)

    const handlePreviewAttachmentChange = (smallDataUrl: string) => {
        recipeDocRef.update({ previewAttachment: smallDataUrl } as Recipe)
    }

    return (
        <>
            <Grid wrap="nowrap" className={classes.attachmentsGridContainer} container spacing={2}>
                {savedAttachments.map((attachment, index) => (
                    <AttachmentPreview
                        onClick={originId => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        previewAttachment={recipePreview?.smallDataUrl}
                        previewChangeDisabled={recipePreview?.disabled}
                        onPreviewAttachmentChange={handlePreviewAttachmentChange}
                        key={attachment.docPath}
                    />
                ))}
                <Grid item>
                    <CardActionArea {...dropzoneProps.getRootProps()}>
                        <Avatar className={classes.addAvatar}>
                            <CloudUploadOutline className={classes.addIcon} />
                        </Avatar>
                        <input {...dropzoneProps.getInputProps()} />
                    </CardActionArea>
                </Grid>
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
