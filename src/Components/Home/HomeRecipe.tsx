import { Box, Card, CardContent, Fab, Grid } from '@material-ui/core'
import ExpandIcon from '@material-ui/icons/ExpandMoreTwoTone'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { AttachementMetadata, Recipe } from '../../model/model'
import RecipeResult from '../Recipe/Result/RecipeResult'

interface HomeRecipeProps {
    recipes: Array<Recipe<AttachementMetadata>>
    expandDisabled: boolean
    onExpandClick: (lastRecipeName: string) => void
}

export const HomeRecipe = (props: HomeRecipeProps) => {
    const handleExpandClick = () => {
        if (props.recipes.length === 0) return
        props.onExpandClick(props.recipes[props.recipes.length - 1].name)
    }

    return (
        <Box marginBottom={2}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        {props.recipes.map(recipe => (
                            <Grid xs={12} item key={recipe.name}>
                                <RecipeResult variant="summary" recipe={recipe} />
                            </Grid>
                        ))}
                        {props.recipes.length === 0 &&
                            new Array(4).fill(1).map((_skeleton, index) => (
                                <Grid xs={12} item key={index}>
                                    <Grid
                                        container
                                        spacing={2}
                                        justify="space-between"
                                        alignItems="center">
                                        <Grid xs={12} item>
                                            <Skeleton width="100%" height={120} variant="rect" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                    </Grid>
                </CardContent>
            </Card>

            <Box marginTop={2} display="flex" justifyContent="space-evenly">
                <Fab
                    disabled={props.expandDisabled}
                    size="small"
                    color="primary"
                    onClick={handleExpandClick}>
                    <ExpandIcon />
                </Fab>
            </Box>
        </Box>
    )
}
