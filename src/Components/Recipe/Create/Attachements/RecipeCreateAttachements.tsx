import { Box, Grid } from '@material-ui/core'
import React, { FC } from 'react'

import { ReactComponent as NotFoundIcon } from '../../../../icons/notFound.svg'
import { AttachementData, AttachementMetadata } from '../../../../model/model'
import RecipeCreateAttachementsCard, {
    AttachementsCardChangeHandler,
} from './RecipeCreateAttachementsCard'

interface RecipeCreateAttachementsProps extends AttachementsCardChangeHandler {
    onAttachements: (newFiles: Array<AttachementData>) => void
    attachements: Array<AttachementData | AttachementMetadata>
}

export const RecipeCreateAttachements: FC<RecipeCreateAttachementsProps> = props => {
    return (
        <Grid
            container
            spacing={2}
            justify={props.attachements.length === 0 ? 'center' : 'flex-start'}>
            {props.attachements.length === 0 && (
                <Box flexGrow={1} display="flex" justifyContent="center">
                    <NotFoundIcon width={150} />
                </Box>
            )}
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
