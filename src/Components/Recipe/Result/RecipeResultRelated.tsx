import React, { FC } from "react";
import { Grid, Chip } from "@material-ui/core";
import LinkIcon from "@material-ui/icons/LinkTwoTone";
import { CategoryBase } from "../../Category/CategoryBase";
import { PATHS } from "../../Routes/Routes";
import { Navigate } from "../../Routes/Navigate";

export const RecipeResultRelated: FC<{ relatedRecipes: Array<string> }> = ({ relatedRecipes }) => (
    <Grid container spacing={2} alignItems="center">
        {relatedRecipes.map(recipeName => (
            <Grid key={recipeName} item>
                <Navigate to={PATHS.details(recipeName)}>
                    <CategoryBase>
                        <Chip icon={<LinkIcon />} label={recipeName} />
                    </CategoryBase>
                </Navigate>
            </Grid>
        ))}
    </Grid>
);
