import { createStyles, Grid, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

import { AttachementData, AttachementMetadata } from '../../../../model/model'
import RecipeCreateAttachementsCard, {
    AttachementsCardChangeHandler,
} from './RecipeCreateAttachementsCard'

interface RecipeCreateAttachementsProps extends AttachementsCardChangeHandler {
    attachements: Array<AttachementData | AttachementMetadata>
}

const useStyles = makeStyles(() =>
    createStyles({
        gridContainer: {
            overflowX: 'auto',
        },
    })
)

export const RecipeCreateAttachements: FC<RecipeCreateAttachementsProps> = props => {
    const classes = useStyles()

    return (
        <Grid className={classes.gridContainer} wrap="nowrap" container spacing={2}>
            {props.attachements.map(attachement => (
                <RecipeCreateAttachementsCard
                    key={attachement.name}
                    attachement={attachement}
                    onDeleteAttachement={props.onDeleteAttachement}
                    onRemoveAttachement={props.onRemoveAttachement}
                    onSaveAttachement={props.onSaveAttachement}
                />
            ))}
        </Grid>
    )
}
