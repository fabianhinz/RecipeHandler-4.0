import { Grid, makeStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'

import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useAttachmentGalleryContext } from '../Provider/AttachmentGalleryProvider'
import AttachmentPreview from './AttachmentPreview'

interface Props {
    recipe: Recipe
}

const useStyles = makeStyles(theme => ({
    attachmentsRoot: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gridTemplateRows: '1fr',
        gridGap: theme.spacing(2),
    },
}))

const Attachments = ({ recipe }: Props) => {
    const [savedAttachments, setSavedAttachments] = useState<AttachmentDoc[]>([])

    const { handleAnimation } = useAttachmentGalleryContext()

    const classes = useStyles()

    useEffect(
        () =>
            FirebaseService.firestore
                .collection('recipes')
                .doc(recipe.name)
                .collection('attachments')
                .orderBy('createdDate', 'asc')
                .onSnapshot(querySnapshot => {
                    const newAttachments = querySnapshot.docs.map(
                        doc => ({ ...doc.data(), docPath: doc.ref.path } as AttachmentDoc)
                    )
                    setSavedAttachments(newAttachments)
                }),
        [recipe.name]
    )

    const handlePreviewClick = (originId: string, activeAttachment: number) =>
        handleAnimation(originId, savedAttachments!, activeAttachment)

    if (recipe.numberOfAttachments === 0) return <></>

    return (
        <Grid item xs={12}>
            <div className={classes.attachmentsRoot}>
                {savedAttachments.map((attachment, index) => (
                    <AttachmentPreview
                        onClick={(originId: any) => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        key={attachment.docPath}
                    />
                ))}
            </div>
        </Grid>
    )
}

export default Attachments
