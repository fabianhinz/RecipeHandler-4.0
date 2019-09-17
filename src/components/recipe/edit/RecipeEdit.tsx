import React, { FC } from "react";
import RecipeCreate from "../create/RecipeCreate";
import { RouteComponentProps } from "react-router";

const RecipeEdit: FC<RouteComponentProps> = ({ location }) => {
    return <RecipeCreate {...location.state} />;
};

export default RecipeEdit;
