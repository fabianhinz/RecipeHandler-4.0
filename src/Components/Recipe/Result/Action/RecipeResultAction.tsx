import React, { FC } from "react";
import { Grid } from "@material-ui/core";
import { RecipeResultPin } from "./RecipeResultPin";
import { RecipeResultShare } from "./RecipeResultShare";
import { RecipeComments } from "./Comments/RecipeComments";
import { RecipeResultRating } from "./RecipeResultRating";

interface RecipeResultActionProps {
    name: string;
    source: "fromCreate" | "fromDraggable" | "fromExpansionSummary" | "fromRecentlyAdded";
    numberOfComments: number;
}

export const RecipeResultAction: FC<RecipeResultActionProps> = ({
    name,
    source,
    numberOfComments
}) => {
    return (
        <Grid item>
            <Grid container>
                {source !== "fromDraggable" && source !== "fromCreate" && (
                    <Grid item>
                        <RecipeResultPin name={name} />
                    </Grid>
                )}
                <Grid item>
                    <RecipeResultShare name={name} />
                </Grid>
                <Grid>
                    <RecipeComments numberOfComments={numberOfComments} name={name} />
                </Grid>
                <Grid>
                    <RecipeResultRating name={name} />
                </Grid>
            </Grid>
        </Grid>
    );
};
