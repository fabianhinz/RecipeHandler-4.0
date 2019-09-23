import React, { FC } from "react";
import RecipeCreate from "../Create/RecipeCreate";
import { RouteWithRecipeName } from "../../../model/model";
import { useRecipeDoc } from "../../../hooks/useRecipeDoc";
import { Loading } from "../../Shared/Loading";
import { Fade, Box, Card, CardContent } from "@material-ui/core";

const RecipeEdit: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc(routeProps);

    return <>{recipeDocLoading ? <Box margin={2}>
        <Card>
            <CardContent><Loading /></CardContent></Card></Box> : <RecipeCreate {...routeProps} recipe={recipeDoc} />}</>
};

export default RecipeEdit;
