import React, { FC } from "react";
import { Grid } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeCategories } from "./HomeCategories";
import { HomeRecipeResults } from "./HomeRecipeResults";

const Home: FC<RouteComponentProps> = () => {
  return (
    <>
      <Grid direction="column" container spacing={4}>
        <HomeRecentlyAdded />
        <HomeCategories />
        <HomeRecipeResults />
      </Grid>
    </>
  );
};

export default Home;
