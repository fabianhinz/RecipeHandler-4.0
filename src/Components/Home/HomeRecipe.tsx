import { Box, Card, CardContent, Grid, Grow } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'
import { AttachmentMetadata, Recipe } from '../../model/model'
import RecipeResult from '../Recipe/Result/RecipeResult'

interface HomeRecipeProps {
    recipes: Array<Recipe<AttachmentMetadata>>
    skeletons: boolean
}

export const HomeRecipe = ({ recipes, skeletons }: HomeRecipeProps) => (
    <Box marginBottom={2}>
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    {recipes.map(recipe => (
                        <Grid xs={12} item key={recipe.name}>
                            <RecipeResult
                                variant="summary"
                                recipe={recipe}
                                divider={recipe.name !== recipes[recipes.length - 1].name}
                            />
                        </Grid>
                    ))}

                    {skeletons &&
                        recipes.length === 0 &&
                        new Array(4).fill(1).map((_skeleton, index) => (
                            <Grid xs={12} item key={index}>
                                <Grid
                                    container
                                    spacing={2}
                                    justify="space-between"
                                    alignItems="center">
                                    <Grid xs={12} item>
                                        <Skeleton width="100%" height={125} variant="rect" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}

                    {!skeletons && recipes.length === 0 && (
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center">
                                <Grow in timeout={500}>
                                    <NotFoundIcon width={200} />
                                </Grow>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    </Box>
)
