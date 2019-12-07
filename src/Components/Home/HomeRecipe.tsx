import { Box, Card, CardContent, Fab, Grid, Grow } from '@material-ui/core'
import ExpandIcon from '@material-ui/icons/ExpandMoreTwoTone'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { ReactComponent as NotFoundIcon } from '../../icons/notFound.svg'
import { AttachmentMetadata, Recipe } from '../../model/model'
import RecipeResult from '../Recipe/Result/RecipeResult'

interface HomeRecipeProps {
    recipes: Array<Recipe<AttachmentMetadata>>
    skeletons: boolean
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
                        {props.recipes.map((recipe, index) => (
                            <Grid xs={12} item key={recipe.name}>
                                <RecipeResult
                                    variant="summary"
                                    recipe={recipe}
                                    divider={
                                        recipe.name !== props.recipes[props.recipes.length - 1].name
                                    }
                                />
                            </Grid>
                        ))}
                        {props.skeletons &&
                            props.recipes.length === 0 &&
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
                        {!props.skeletons && props.recipes.length === 0 && (
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
