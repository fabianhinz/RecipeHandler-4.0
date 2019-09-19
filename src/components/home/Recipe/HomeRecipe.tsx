import ExpandIcon from "@material-ui/icons/ExpandMoreTwoTone";
import React, { FC } from "react";
import { Box, Fab, Tooltip } from "@material-ui/core";
import { HomeRecipeResults } from "./HomeRecipeResults";
import { AttachementMetadata, Recipe } from "../../../model/model";

interface HomeRecipeProps {
    recipes: Array<Recipe<AttachementMetadata>>;
    onExpandClick: (lastRecipeName: string) => void;
}

export const HomeRecipe: FC<HomeRecipeProps> = props => {
    const handleExpandClick = () => {
        if (props.recipes.length === 0) return;
        props.onExpandClick(props.recipes[props.recipes.length - 1].name);
    };

    return (
        <Box margin={2}>
            <div>
                {props.recipes.map(recipe => (
                    <HomeRecipeResults key={recipe.name} recipe={recipe} />
                ))}
            </div>

            <Box marginTop={2} display="flex" justifyContent="center">
                <Tooltip title="Weitere Rezepte laden">
                    <Fab size="small" color="secondary" onClick={handleExpandClick}>
                        <ExpandIcon />
                    </Fab>
                </Tooltip>
            </Box>
        </Box>
    );
};
