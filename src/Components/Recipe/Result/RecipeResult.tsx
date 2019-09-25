import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { RecipeResultImg } from "./RecipeResultImg";
import { Grid, Typography, Box, Slide, Button } from "@material-ui/core";
import { Recipe, AttachementData, AttachementMetadata } from "../../../model/model";
import { Subtitle } from "../../Shared/Subtitle";
import { CategoryResult } from "../../Category/CategoryResult";
import { ReactComponent as NotFoundIcon } from "../../../icons/notFound.svg";
import { useRouterContext } from "../../Provider/RouterProvider";
import { useFirebaseAuthContext } from "../../Provider/FirebaseAuthProvider";
import { PATHS } from "../../Routes/Routes";
import { FirebaseService } from "../../../firebase";

interface RecipeResultProps {
    recipe: Recipe<AttachementMetadata | AttachementData> | null;
    preview?: boolean;
}

export const RecipeResult: FC<RecipeResultProps> = ({ recipe, preview }) => {
    const { history } = useRouterContext();
    const { user } = useFirebaseAuthContext();

    if (!recipe)
        return (
            <Box display="flex" justifyContent="center">
                <Slide in direction="down" timeout={500}>
                    <NotFoundIcon width={200} />
                </Slide>
            </Box>
        );

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

            <Grid item xs={12} />

            <Grid item xs={12} md={6} lg={4}>
                <Subtitle icon={<AssignmentIcon />} text={`Zutaten für ${recipe.amount}`} />
                <ReactMarkdown source={recipe.ingredients} />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
                <Subtitle icon={<BookIcon />} text="Beschreibung" />
                <ReactMarkdown source={recipe.description} />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption">
                    Erstellt am:{" "}
                    {FirebaseService.createDateFromTimestamp(
                        recipe.createdDate
                    ).toLocaleDateString()}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                {user && !preview && (
                    <Box textAlign="right">
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => history.push(PATHS.recipeEdit(recipe.name), { recipe })}
                        >
                            Bearbeiten
                        </Button>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};
