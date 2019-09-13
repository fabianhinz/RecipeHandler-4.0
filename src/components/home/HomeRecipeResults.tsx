import React, { FC, useState, useEffect, useCallback } from "react";
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
  Paper,
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
  const [page, setPage] = useState({ label: 1, offset: 0 });
  const classes = useStyles();

  const results = MOCK_RESULTS.slice(page.offset, page.offset + 4);
  const isUpDisabled = results.length < 4;
  const isDownDisabled = page.label === 1;

  const handlePageChange = useCallback(
    (change: "up" | "down") => () => {
      if (change === "up" && !isUpDisabled)
        setPage(previous => ({
          label: ++previous.label,
          offset: previous.offset + 4
        }));
      if (change === "down" && !isDownDisabled)
        setPage(previous => ({
          label: --previous.label,
          offset: previous.offset - 4
        }));
    },
    [isDownDisabled, isUpDisabled]
  );

  const rightLeftHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") handlePageChange("down")();
      if (event.code === "ArrowRight") handlePageChange("up")();
    },
    [handlePageChange]
  );

  useEffect(() => {
    document.addEventListener("keydown", rightLeftHandler);

    return () => {
      document.removeEventListener("keydown", rightLeftHandler);
    };
  }, [rightLeftHandler]);

  return (
    <Grid item>
      <Grid container spacing={2} direction="column">
        <Grid item>
          {results.map(rezept => (
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
                  <Grid item>
                    <Typography variant="caption">
                      Erstellt am {new Date().toLocaleDateString()}
                    </Typography>
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
                  <ButtonBase
                    disabled={isDownDisabled}
                    onClick={handlePageChange("down")}
                  >
                    <ChevronLeft />
                  </ButtonBase>
                </Grid>
                <Grid item>
                  <Typography>{page.label}</Typography>
                </Grid>
                <Grid item>
                  <ButtonBase
                    disabled={isUpDisabled}
                    onClick={handlePageChange("up")}
                  >
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
