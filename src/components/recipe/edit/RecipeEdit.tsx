import React, { FC } from "react";
import RecipeCreate from "../Create/RecipeCreate";
import { RouteComponentProps } from "react-router";
// ToDo fetch data from firestore when location.state.recipe is "empty"
const RecipeEdit: FC<RouteComponentProps> = ({ history, location }) => {
    return <RecipeCreate history={history} location={location} recipe={location.state.recipe} />;
};

export default RecipeEdit;
