import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { CalendarMonth } from 'mdi-material-ui'
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
    const { isMobile } = useBreakpointsContext()

    const classes = useStyles()

    const minifiedLayout = isMobile
    const nameLayout = variant === 'pinned' || variant === 'related'
    const actionsLayout = variant === 'details'

    return (
        <Grid container spacing={2} justify="space-between" alignItems="center">
            <Grid item xs={nameLayout ? 12 : minifiedLayout ? 11 : 8}>
                <Grid container spacing={1} direction="column" justify="center">
                    <Grid item>
                        <Navigate disabled={nameLayout} to={PATHS.details(recipe.name)}>
                            <Typography
                                gutterBottom
                                className={classes.recipeName}
                                display="inline"
                                variant="h4">
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
            {actionsLayout && (
                <Grid item xs={minifiedLayout ? 1 : 4}>
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
