import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { RecipeResultImg } from "./RecipeResultImg";
import { Grid, Typography } from "@material-ui/core";
import { Recipe, AttachementData, AttachementMetadata } from "../../../model/model";
import { Subtitle } from "../../Shared/Subtitle";
import { CategoryResult } from "../../Category/CategoryResult";

interface RecipeResultProps {
    recipe: Recipe<AttachementMetadata | AttachementData> | null;
}

export const RecipeResult: FC<RecipeResultProps> = ({ recipe }) => {
    if (!recipe) return <Typography>not found</Typography>

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">{recipe.name}</Typography>
            </Grid>

            <Grid item>
                <CategoryResult categories={recipe.categories} />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {recipe.attachements.map(attachement => (
                        <RecipeResultImg key={attachement.name} attachement={attachement} />
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
                <ReactMarkdown source={recipe.ingredients} />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
                <Subtitle icon={<BookIcon />} text="Beschreibung" />
                <ReactMarkdown source={recipe.description} />
            </Grid>

            <Grid item xs={12}>
                {/* <Typography variant="caption">Erstellt am: {created}</Typography> */}
            </Grid>
        </Grid>
    );
};
