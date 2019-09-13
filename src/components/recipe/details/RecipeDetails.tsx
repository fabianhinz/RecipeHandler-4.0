import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { Fade } from "@material-ui/core";

interface RouteParams {
  id: string;
}

const RecipeDetails: FC<RouteComponentProps<RouteParams>> = props => (
  <Fade in>
    <div>details works {props.match.params.id}</div>
  </Fade>
);

export default RecipeDetails;
