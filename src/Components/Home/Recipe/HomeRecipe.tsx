import { Box, Fab } from '@material-ui/core'
import ExpandIcon from '@material-ui/icons/ExpandMoreTwoTone'
import React from 'react'

import { AttachementMetadata, Recipe } from '../../../model/model'
import HomeRecipeResults from './HomeRecipeResults'

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
            <div>
                {props.recipes.map(recipe => (
                    <HomeRecipeResults key={recipe.name} recipe={recipe} />
                ))}
            </div>

            <Box marginTop={2} display="flex" justifyContent="space-evenly">
                <div>
                    <Fab
                        disabled={props.expandDisabled}
                        size="small"
                        color="primary"
                        onClick={handleExpandClick}>
                        <ExpandIcon />
                    </Fab>
                </div>
            </Box>
        </Box>
    )
}
