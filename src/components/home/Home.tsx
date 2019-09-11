import AddIcon from "@material-ui/icons/AddTwoTone";
import React, { FC } from "react";
import {
  Container,
  createStyles,
  Fab,
  Grid,
  makeStyles
} from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { PATHS } from "../../routes/Routes";
import { HomeRecentlyAdded } from "./HomeRecentlyAdded";
import { HomeCategories } from "./HomeCategories";
import { HomeRecipeResults } from "./HomeRecipeResults";

const useStyles = makeStyles(theme =>
  createStyles({
    footerContainer: {
      display: "flex",
      justifyContent: "flex-end",
      position: "fixed",
      bottom: theme.spacing(3),
      right: 0,
      left: 0
    }
  })
);

const Home: FC<RouteComponentProps> = props => {
  const classes = useStyles();

  return (
    <>
      <Grid direction="column" container spacing={4}>
        <HomeRecentlyAdded />
        <HomeCategories />
        <HomeRecipeResults />
      </Grid>

      <Container maxWidth="lg" className={classes.footerContainer}>
        <Fab
          color="secondary"
          variant="extended"
          onClick={() => props.history.push(PATHS.recipeCreate)}
        >
          <AddIcon /> anlegen
        </Fab>
      </Container>
    </>
  );
};

export default Home;
