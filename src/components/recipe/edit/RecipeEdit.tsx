import React, { FC, useEffect, useState } from "react";
import RecipeCreate from "../Create/RecipeCreate";
import { RouteComponentProps } from "react-router";
import { Recipe, AttachementMetadata } from "../../../model/model";
import { PATHS } from "../../Routes/Routes";

const RecipeEdit: FC<RouteComponentProps> = ({ history, location, ...moreRouterProps }) => {
    const [recipe, setRecipe] = useState<Recipe<AttachementMetadata> | null>(null);

    useEffect(() => {
        if (location.state && location.state.recipe) {
            setRecipe(location.state.recipe as Recipe<AttachementMetadata>);
        } else {
            history.push(PATHS.recipeCreate, {
                message: "Rezept nicht gefunden, bestimmt möchtest du eines anlegen"
            });
        }
    }, [history, location.state]);

    return <RecipeCreate history={history} location={location} recipe={recipe} />;
};

export default RecipeEdit;
