import { Grid } from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'

import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useAttachmentGalleryContext } from '../Provider/AttachmentGalleryProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import ExpandableGridContainer from '../Shared/ExpandableGridContainer'
import AttachmentPreview from './AttachmentPreview'

interface Props extends Pick<Recipe, 'numberOfAttachments'> {
    recipeName: string
}

const Attachments = ({ recipeName, numberOfAttachments }: Props) => {
    const [savedAttachments, setSavedAttachments] = useState<AttachmentDoc[]>([])
    const [recipePreview, setRecipePreview] = useState<
        { smallDataUrl?: string; disabled: boolean } | undefined
    >()

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

    const handlePreviewAttachmentChange = (smallDataUrl: string | undefined) => {
        recipeDocRef.update({ previewAttachment: smallDataUrl } as Recipe)
    }

    if (numberOfAttachments === 0) return <></>

    return (
        <Grid item xs={12}>
            <ExpandableGridContainer
                titles={{
                    expanded: 'weniger anzeigen',
                    notExpanded: 'alle anzeigen',
                }}
                itemHeight={400}>
                {savedAttachments.map((attachment, index) => (
                    <AttachmentPreview
                        itemHeight={400}
                        onClick={originId => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        previewAttachment={recipePreview?.smallDataUrl}
                        previewChangeDisabled={recipePreview?.disabled}
                        onPreviewAttachmentChange={handlePreviewAttachmentChange}
                        key={attachment.docPath}
                    />
                ))}
            </ExpandableGridContainer>
        </Grid>
    )
}

export default Attachments
