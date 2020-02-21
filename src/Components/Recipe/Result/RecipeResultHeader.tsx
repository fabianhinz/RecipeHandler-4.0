import { Grid, Typography } from '@material-ui/core'
import React from 'react'

import { Recipe, RecipeVariants } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { CategoryResult } from '../../Category/CategoryResult'
import { RecipeResultAction } from './Action/RecipeResultAction'

interface Props extends RecipeVariants {
    recipe: Recipe
}

const RecipeResultHeader = ({ recipe, variant }: Props) => (
    <Grid container spacing={2} justify="space-between" alignItems="center">
        <Grid item xs={12} sm={variant === 'related' ? 12 : 6} md={8} lg={9}>
            <Typography gutterBottom display="inline" variant="h5">
                {recipe.name}
            </Typography>
            <Typography color="textSecondary">
                {FirebaseService.createDateFromTimestamp(recipe.createdDate).toLocaleDateString()}
            </Typography>
        </Grid>
        {variant === 'details' && (
            <Grid item xs={12} sm="auto">
                <RecipeResultAction name={recipe.name} numberOfComments={recipe.numberOfComments} />
            </Grid>
        )}
        <Grid item xs={12}>
            <CategoryResult color="secondary" categories={recipe.categories} />
        </Grid>
    </Grid>
)

export default RecipeResultHeader
