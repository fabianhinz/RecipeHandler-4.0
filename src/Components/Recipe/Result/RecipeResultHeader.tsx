import { Grid, Typography } from '@material-ui/core'
import React from 'react'

import { AttachmentData, AttachmentMetadata, Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { CategoryResult } from '../../Category/CategoryResult'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { RecipeResultAction, RecipeVariants } from './Action/RecipeResultAction'

interface Props extends RecipeVariants {
    recipe: Recipe<AttachmentMetadata | AttachmentData>
}

const RecipeResultHeader = ({ recipe, variant }: Props) => {
    const { isMobile } = useBreakpointsContext()

    const minifiedLayout = isMobile && variant === 'summary'
    const nameLayout = variant === 'pinned' || variant === 'related'
    const actionsLayout = variant === 'details' || variant === 'summary'

    return (
        <Grid container spacing={2} justify="space-between" alignItems="center">
            <Grid item xs={nameLayout ? 12 : minifiedLayout ? 11 : 7}>
                <Navigate disabled={nameLayout} to={PATHS.details(recipe.name)}>
                    <Typography display="inline" variant="h5">
                        {recipe.name}
                    </Typography>
                </Navigate>
                <Typography color="textSecondary">
                    Zuletzt geändert am{' '}
                    {FirebaseService.createDateFromTimestamp(
                        recipe.createdDate
                    ).toLocaleDateString()}
                </Typography>
            </Grid>
            {actionsLayout && (
                <Grid item xs={minifiedLayout ? 1 : 5}>
                    <RecipeResultAction
                        pinOnly={minifiedLayout}
                        name={recipe.name}
                        numberOfComments={recipe.numberOfComments}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <CategoryResult categories={recipe.categories} />
            </Grid>
        </Grid>
    )
}

export default RecipeResultHeader
