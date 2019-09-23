import React, { FC } from "react";
import { Chip, Grid } from "@material-ui/core";
import { Categories } from "../../model/model";
import { avatarFromCategoryType } from "./CategoryWrapper";

interface CategoryResultProps {
    categories: Categories<string>;
}

export const CategoryResult: FC<CategoryResultProps> = ({ categories }) => (
    <Grid container spacing={1}>
        {Object.keys(categories).map(type => (
            <Grid item key={type}>
                {categories[type].length > 0 && (
                    <Chip
                        avatar={avatarFromCategoryType(type)}
                        size="small"
                        color="secondary"
                        label={categories[type]}
                    />
                )}
            </Grid>
        ))}
    </Grid>
);
