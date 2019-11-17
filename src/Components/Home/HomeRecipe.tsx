import { Box, Card, CardContent, Fab, Grid } from '@material-ui/core'
import ExpandIcon from '@material-ui/icons/ExpandMoreTwoTone'
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
