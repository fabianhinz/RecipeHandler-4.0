import React, { FC, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreTwoTone";
import {
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  makeStyles,
  Typography,
  ExpansionPanelActions,
  Button,
  Fab,
  ButtonGroup,
  Card,
  CardContent,
  Paper,
  IconButton,
  ButtonBase
} from "@material-ui/core";
import { PATHS } from "../../routes/Routes";
import { Navigate } from "../../routes/Navigate";
import pfannkuchenImg from "../../images/pfannkuchen.jpg";
import blueGrey from "@material-ui/core/colors/blueGrey";
import { CategoryChipsReadonly } from "../category/CategoryChips";
import {
  MOCK_CATEGORIES,
  MOCK_TIME_CATEGORIES,
  MOCK_RECIPES,
  MOCK_RESULTS
} from "../../util/Mock";
import { BadgeRating } from "../../util/BadgeRating";
import ChevronLeft from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRight from "@material-ui/icons/ChevronRightTwoTone";

const useStyles = makeStyles(theme =>
  createStyles({
    img: {
      borderRadius: 10
    },
    detailsBtn: {
      boxShadow: "none",
      color: theme.palette.getContrastText(blueGrey[700]),
      background: blueGrey[700],
      "&:hover": {
        background: blueGrey[900]
      }
    }
  })
);

export const HomeRecipeResults: FC = () => {
  const [page, setPage] = useState(0);
  const classes = useStyles();

  return (
    <Grid item>
      <Grid container spacing={2} direction="column">
        <Grid item>
          {MOCK_RESULTS.slice(page, page + 4).map(rezept => (
            <ExpansionPanel
              key={rezept}
              TransitionProps={{ unmountOnExit: true, mountOnEnter: true }}
            >
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
                    <BadgeRating />
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <CategoryChipsReadonly
                      color="primary"
                      items={MOCK_CATEGORIES.slice(1, 3)}
                    />
                  </Grid>
                  <Grid item>
                    <CategoryChipsReadonly
                      color="secondary"
                      variant="time"
                      items={MOCK_TIME_CATEGORIES.slice(1, 4)}
                    />
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
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore et dolore magna aliquyam erat, sed diam
                          voluptua. At vero eos et accusam et justo duo dolores
                          et ea rebum. Stet clita kasd gubergren, no sea
                          takimata sanctus est Lorem ipsum dolor sit amet.
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
        <Grid item>
          <Grid container justify="center">
            <Paper>
              <Grid container spacing={1}>
                <Grid item>
                  <ButtonBase onClick={() => setPage(previous => previous - 4)}>
                    <ChevronLeft />
                  </ButtonBase>
                </Grid>
                <Grid item>
                  <ButtonBase onClick={() => setPage(previous => previous + 4)}>
                    <ChevronRight />
                  </ButtonBase>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
