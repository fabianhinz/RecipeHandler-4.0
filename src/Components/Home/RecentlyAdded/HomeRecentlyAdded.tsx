import React, { FC } from "react";
import { Box, Grid } from "@material-ui/core";
import { Recipe, AttachementMetadata } from "../../../model/model";
import { HomeRecentlyAddedCard } from "./HomeRecentlyAddedCard";

interface HomeRecentlyAddedProps {
    recipes: Array<Recipe<AttachementMetadata>>;
}

export const HomeRecentlyAdded: FC<HomeRecentlyAddedProps> = ({ recipes }) => (
    <Box margin={2}>
        <Grid container spacing={2}>
            {recipes.map(recipe => (
                <HomeRecentlyAddedCard key={recipe.name} recipe={recipe} />
            ))}
        </Grid>
    </Box>
);
