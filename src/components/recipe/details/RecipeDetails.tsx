import React, { FC } from "react";
import { RouteComponentProps } from "react-router";

interface RouteParams {
  id: string;
}

const RecipeDetails: FC<RouteComponentProps<RouteParams>> = props => (
  <div>details works {props.match.params.id}</div>
);

export default RecipeDetails;
