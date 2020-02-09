import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { CalendarMonth } from 'mdi-material-ui'
import React from 'react'

import { Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { CategoryResult } from '../../Category/CategoryResult'
import { Navigate } from '../../Routes/Navigate'
import { PATHS } from '../../Routes/Routes'
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
            <Grid item xs={variant === 'related' ? 12 : 7} md={variant === 'related' ? 12 : 8}>
                <Grid container spacing={1} direction="column" justify="center">
                    <Grid item>
                        <Navigate
                            disabled={variant === 'related' || variant === 'preview'}
                            to={PATHS.details(recipe.name)}>
                            <Typography
                                gutterBottom
                                className={classes.recipeName}
                                display="inline"
                                variant={variant === 'related' ? 'h6' : 'h5'}>
                                {recipe.name}
                            </Typography>
                        </Navigate>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <CalendarMonth />
                            </Grid>
                            <Grid item>
                                <Typography className={classes.recipeDate} color="textSecondary">
                                    {FirebaseService.createDateFromTimestamp(
                                        recipe.createdDate
                                    ).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {variant === 'details' && (
                <Grid item xs={5} md={4}>
                    <RecipeResultAction
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
