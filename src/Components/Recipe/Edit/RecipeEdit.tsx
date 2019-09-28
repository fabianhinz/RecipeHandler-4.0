import React, { FC } from "react";
import RecipeCreate from "../Create/RecipeCreate";
import { RouteWithRecipeName } from "../../../model/model";
import { useRecipeDoc } from "../../../hooks/useRecipeDoc";
import { Loading } from "../../Shared/Loading";
import { Card, CardContent } from "@material-ui/core";

const RecipeEdit: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps });

    return (
        <>
            {recipeDocLoading ? (
                <Card>
                    <CardContent>
                        <Loading />
                    </CardContent>
                </Card>
            ) : (
                <RecipeCreate {...routeProps} recipe={recipeDoc} edit />
            )}
        </>
    );
};

export default RecipeEdit;
