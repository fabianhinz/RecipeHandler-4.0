import { createStyles, Grid, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

import { AttachmentData, AttachmentMetadata } from '../../../../model/model'
import RecipeCreateAttachmentsCard, {
    AttachmentsCardChangeHandler,
} from './RecipeCreateAttachmentsCard'

interface RecipeCreateAttachmentsProps extends AttachmentsCardChangeHandler {
    attachments: Array<AttachmentData | AttachmentMetadata>
}

const useStyles = makeStyles(() =>
    createStyles({
        gridContainer: {
            overflowX: 'auto',
        },
    })
)

export const RecipeCreateAttachments: FC<RecipeCreateAttachmentsProps> = props => {
    const classes = useStyles()

    return (
        <Grid className={classes.gridContainer} wrap="nowrap" container spacing={2}>
            {props.attachments.map(attachment => (
                <RecipeCreateAttachmentsCard
                    key={attachment.name}
                    attachment={attachment}
                    onDeleteAttachment={props.onDeleteAttachment}
                    onRemoveAttachment={props.onRemoveAttachment}
                    onSaveAttachment={props.onSaveAttachment}
                />
            ))}
        </Grid>
    )
}
