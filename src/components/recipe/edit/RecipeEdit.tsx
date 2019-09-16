import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import RecipeCreate from "../create/RecipeCreate";

const RecipeEdit: FC<RouteComponentProps> = ({ location }) => {
  return <RecipeCreate {...location.state} />;
};

export default RecipeEdit;
