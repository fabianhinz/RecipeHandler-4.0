import { Grid, Typography } from '@material-ui/core'
import React from 'react'

import { Recipe } from '../../../model/model'
import { CategoryResult } from '../../Category/CategoryResult'
import RecipeResultButtons from './RecipeResultButtons'

interface Props {
    recipe: Recipe
}

const RecipeResultHeader = ({ recipe }: Props) => (
    <Grid container spacing={2} justify="space-between" alignItems="center">
        <Grid item xs={12} sm={6} md={8} lg={9}>
            <Typography gutterBottom display="inline" variant="h5">
                {recipe.name}
            </Typography>
        </Grid>

        <Grid item xs={12} sm="auto">
            <RecipeResultButtons name={recipe.name} numberOfComments={recipe.numberOfComments} />
        </Grid>

        <Grid item xs={12}>
            <CategoryResult color="secondary" categories={recipe.categories} />
        </Grid>
    </Grid>
)

export default RecipeResultHeader
