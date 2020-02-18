import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { CalendarMonth } from 'mdi-material-ui'
import React from 'react'

import { Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { CategoryResult } from '../../Category/CategoryResult'
import { RecipeResultAction, RecipeVariants } from './Action/RecipeResultAction'

interface Props extends RecipeVariants {
    recipe: Recipe
}

const useStyles = makeStyles(() =>
    createStyles({
        recipeName: {
            fontFamily: "'Lato', sans-serif",
        },
        recipeDate: {
            fontFamily: "'Raleway', sans-serif",
        },
    })
)

const RecipeResultHeader = ({ recipe, variant }: Props) => {
    const classes = useStyles()

    return (
        <Grid container spacing={2} justify="space-between" alignItems="center">
            <Grid item xs={12} sm={variant === 'related' ? 12 : 6} md={8} lg={9}>
                {variant !== 'related' ? (
                    <Typography
                        gutterBottom
                        className={classes.recipeName}
                        display="inline"
                        variant="h5">
                        {recipe.name}
                    </Typography>
                ) : (
                    <Grid container spacing={1} direction="column" justify="center">
                        <Grid item>
                            <Typography
                                gutterBottom
                                className={classes.recipeName}
                                display="inline"
                                variant="h6">
                                {recipe.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <CalendarMonth />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        className={classes.recipeDate}
                                        color="textSecondary">
                                        {FirebaseService.createDateFromTimestamp(
                                            recipe.createdDate
                                        ).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
            {variant === 'details' && (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RecipeResultAction
                        name={recipe.name}
                        numberOfComments={recipe.numberOfComments}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <CategoryResult color="secondary" categories={recipe.categories} />
            </Grid>
        </Grid>
    )
}

export default RecipeResultHeader
