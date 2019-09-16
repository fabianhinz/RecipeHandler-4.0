import React, { FC } from "react";
import { Fade } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeCategories } from "./HomeCategories";
import { HomeRecipeResults } from "./HomeRecipeResults";

const Home: FC<RouteComponentProps> = () => {
  return (
    <Fade in>
      <>
        <HomeRecentlyAdded />
        <HomeCategories />
        <HomeRecipeResults />
      </>
    </Fade>
  );
};

export default Home;
