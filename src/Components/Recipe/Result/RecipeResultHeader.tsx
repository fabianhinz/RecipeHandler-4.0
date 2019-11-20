import { Grid, Typography } from '@material-ui/core'
import React from 'react'

import { AttachementData, AttachementMetadata, Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { CategoryResult } from '../../Category/CategoryResult'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
import { RecipeResultAction, RecipeVariants } from './Action/RecipeResultAction'

interface Props extends RecipeVariants {
    recipe: Recipe<AttachementMetadata | AttachementData>
}

const RecipeResultHeader = ({ recipe, variant }: Props) => (
    <Grid container spacing={2} justify="space-between" alignItems="center">
        <Grid item xs={variant === 'pinned' ? 12 : 8}>
            <Navigate to={PATHS.details(recipe.name)}>
                <Typography display="inline" variant="h5">
                    {recipe.name}
                </Typography>
            </Navigate>
            <Typography color="textSecondary">
                Zuletzt geändert am{' '}
                {FirebaseService.createDateFromTimestamp(recipe.createdDate).toLocaleDateString()}
            </Typography>
        </Grid>
        {variant !== 'pinned' && variant !== 'preview' && (
            <Grid item xs={4}>
                <RecipeResultAction name={recipe.name} numberOfComments={recipe.numberOfComments} />
            </Grid>
        )}
        <Grid item xs={12}>
            <CategoryResult categories={recipe.categories} />
        </Grid>
    </Grid>
)

export default RecipeResultHeader
