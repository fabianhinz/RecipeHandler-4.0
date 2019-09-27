import React, { FC } from "react";
import RecipeResult from "../Result/RecipeResult";
import { Card, CardContent, Box, Fade } from "@material-ui/core";
import { Loading } from "../../Shared/Loading";
import { useRecipeDoc } from "../../../hooks/useRecipeDoc";
import { RouteWithRecipeName } from "../../../model/model";

const RecipeDetails: FC<RouteWithRecipeName> = routeProps => {
    const { recipeDoc, recipeDocLoading } = useRecipeDoc({ routeProps });

    return (
        <Fade in>
            <Box margin={2}>
                <Card>
                    <CardContent>
                        {recipeDocLoading ? <Loading /> : <RecipeResult recipe={recipeDoc} />}
                    </CardContent>
                </Card>
            </Box>
        </Fade>
    );
};

export default RecipeDetails;
