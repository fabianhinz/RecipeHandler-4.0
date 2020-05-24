import { createStyles, Grid, makeStyles } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useEffect, useState } from 'react'

import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useAttachmentGalleryContext } from '../Provider/AttachmentGalleryProvider'
import AttachmentPreview from './AttachmentPreview'

interface Props {
    recipe: Recipe
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            overflowX: 'auto',
            [theme.breakpoints.between('xs', 'sm')]: {
                height: 250,
            },
            [theme.breakpoints.between('md', 'lg')]: {
                height: 300,
            },
            [theme.breakpoints.up('xl')]: {
                height: 350,
            },
        },
        skeleton: {
            [theme.breakpoints.between('xs', 'sm')]: {
                width: 250 - theme.spacing(4),
                height: 250 - theme.spacing(4),
            },
            [theme.breakpoints.between('md', 'lg')]: {
                width: 300 - theme.spacing(4),
                height: 300 - theme.spacing(4),
            },
            [theme.breakpoints.up('xl')]: {
                width: 350 - theme.spacing(4),
                height: 350 - theme.spacing(4),
            },
        },
    })
)

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
            <Grid wrap="nowrap" className={classes.container} container spacing={2}>
                {savedAttachments.length === 0 &&
                    new Array(recipe.numberOfAttachments).fill(1).map((_, index) => (
                        <Grid item key={index}>
                            <Skeleton variant="circle" className={classes.skeleton} />
                        </Grid>
                    ))}
                {savedAttachments.map((attachment, index) => (
                    <AttachmentPreview
                        onClick={originId => handlePreviewClick(originId, index)}
                        attachment={attachment}
                        key={attachment.docPath}
                    />
                ))}
            </Grid>
        </Grid>
    )
}

export default Attachments
