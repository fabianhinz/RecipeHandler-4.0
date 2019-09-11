import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { RecipeEditor } from "../../../util/RecipeEditor";

const RecipeCreate: FC<RouteComponentProps> = props => {
  return <RecipeEditor />;
};

export default RecipeCreate;
