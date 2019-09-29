import React, { FC } from "react";
import RecipeResult from "../Result/RecipeResult";
import { Card, CardContent } from "@material-ui/core";
import { Loading } from "../../Shared/Loading";
import { useRecipeDoc } from "../../../hooks/useRecipeDoc";
import { RouteWithRecipeName } from "../../../model/model";

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps });

    return (
        <Card>
            <CardContent>
                {recipeDocLoading ? (
                    <Loading />
                ) : (
                    <RecipeResult recipe={recipeDoc} source="fromRecentlyAdded" />
                )}
            </CardContent>
        </Card>
    );
};

export default RecipeDetails;
