import React, { FC } from "react";
import FavoriteIcon from "@material-ui/icons/FavoriteTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreTwoTone";
import {
  Chip,
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  makeStyles,
  Typography,
  ExpansionPanelActions,
  Button
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { PATHS } from "../../routes/Routes";
import { Navigate } from "../../routes/Navigate";
import pfannkuchenImg from "../../images/pfannkuchen.jpg";

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      borderRadius: 10
    }
  })
);

export const HomeRecipeResults: FC = () => {
  const classes = useStyles();

  return (
    <Grid item>
      {["Pfannkuchen", "Salat mit Pute", "herzhafte Muffins"].map(rezept => (
        <ExpansionPanel key={rezept}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
              container
              direction="row"
              spacing={2}
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography>{rezept}</Typography>
              </Grid>
              <Grid item>
                <Rating
                  name="customized-color"
                  value={2.3}
                  precision={1}
                  icon={<FavoriteIcon fontSize="inherit" />}
                />
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container direction="column" spacing={2}>
              <Grid item container spacing={1}>
                <Grid item>
                  <Chip color="primary" label="ToDo Kategorien" />
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2} direction="row">
                  <Grid item xs={4}>
                    <img
                      className={classes.img}
                      src={pfannkuchenImg}
                      alt=""
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua. At vero eos et
                      accusam et justo duo dolores et ea rebum. Stet clita kasd
                      gubergren, no sea takimata sanctus est Lorem ipsum dolor
                      sit amet.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Navigate to={PATHS.recipeDetails(rezept)}>
              <Button>Details</Button>
            </Navigate>
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </Grid>
  );
};
