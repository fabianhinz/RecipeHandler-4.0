import React, { FC } from "react";
import { Fade, Grid } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeCategories } from "./HomeCategories";
import { HomeRecipeResults } from "./HomeRecipeResults";

const Home: FC<RouteComponentProps> = () => {
  return (
    <Fade in>
      <Grid direction="column" container spacing={4}>
        <HomeRecentlyAdded />
        <HomeCategories />
        <HomeRecipeResults />
      </Grid>
    </Fade>
  );
};

export default Home;
