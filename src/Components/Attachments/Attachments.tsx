import { createStyles, Grid, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'

import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useAttachmentGalleryContext } from '../Provider/AttachmentGalleryProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import AttachmentPreview from './AttachmentPreview'

const useStyles = makeStyles(theme =>
    createStyles({
        attachmentsGridContainer: {
            overflowX: 'auto',
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

    const recipeDocRef = useMemo(
        () => FirebaseService.firestore.collection('recipes').doc(recipeName),
        [recipeName]
    )

    useEffect(
        () =>
            recipeDocRef
                .collection('attachments')
                .orderBy('createdDate', 'asc')
                .onSnapshot(querySnapshot => {
                    const newAttachments = querySnapshot.docs.map(
                        doc => ({ ...doc.data(), docPath: doc.ref.path } as AttachmentDoc)
                    )
                    setSavedAttachments(newAttachments)
                }),
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
        handleAnimation(originId, savedAttachments!, activeAttachment)

    const handlePreviewAttachmentChange = (smallDataUrl: string) => {
        recipeDocRef.update({ previewAttachment: smallDataUrl } as Recipe)
    }

    return (
        <>
            {savedAttachments.length > 0 && (
                <Grid item xs={12}>
                    <Grid
                        wrap="nowrap"
                        className={classes.attachmentsGridContainer}
                        container
                        spacing={2}>
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
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default Attachments
