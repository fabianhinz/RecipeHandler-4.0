import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { Fade } from "@material-ui/core";

const RecipeEdit: FC<RouteComponentProps> = ({ location }) => {
  console.log(location.state);
  return (
    <Fade in>
      <div>edit works</div>
    </Fade>
  );
};

export default RecipeEdit;
