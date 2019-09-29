import React, { FC } from "react";
import { Grid } from "@material-ui/core";
import { RecipePin } from "./RecipePin";
import { RecipeShare } from "./RecipeShare";
import { RecipeComments } from "./Comments/RecipeComments";
import { RecipeRating } from "./RecipeRating";

interface RecipeHeaderLeftProps {
    name: string;
    source: "fromCreate" | "fromDraggable" | "fromExpansionSummary" | "fromRecentlyAdded";
    numberOfComments: number;
}

export const RecipeHeaderLeft: FC<RecipeHeaderLeftProps> = ({ name, source, numberOfComments }) => {
    return (
        <Grid item>
            <Grid container>
                {source !== "fromDraggable" && source !== "fromCreate" && (
                    <Grid item>
                        <RecipePin name={name} />
                    </Grid>
                )}
                <Grid item>
                    <RecipeShare name={name} />
                </Grid>
                <Grid>
                    <RecipeComments numberOfComments={numberOfComments} name={name} />
                </Grid>
                <Grid>
                    <RecipeRating name={name} />
                </Grid>
            </Grid>
        </Grid>
    );
};
