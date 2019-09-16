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
  ButtonBase,
  Avatar,
  Box
} from "@material-ui/core";
import { PATHS } from "../../routes/Routes";
import { Navigate } from "../../routes/Navigate";
import pfannkuchenImg from "../../images/pfannkuchen.jpg";
import brown from "@material-ui/core/colors/brown";
import { CategoryChipsReadonly } from "../category/CategoryChips";
import {
  MOCK_CATEGORIES,
  MOCK_TIME_CATEGORIES,
  MOCK_RESULTS
} from "../../util/Mock";
import { BadgeRating } from "../../util/BadgeRating";
import ChevronLeft from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRight from "@material-ui/icons/ChevronRightTwoTone";
import { RecipeResult } from "../recipe/result/RecipeResult";

const useStyles = makeStyles(theme => {
  const background = theme.palette.type === "light" ? brown[200] : brown[400];

  return createStyles({
    avatar: {
      background,
      color: theme.palette.getContrastText(background)
    }
  });
});

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
    <Box margin={2}>
      <div>
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
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar className={classes.avatar}>
                        {rezept.slice(0, 1).toUpperCase()}
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography variant="button">{rezept}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <BadgeRating />
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <RecipeResult
                name="TBD"
                created={new Date().toLocaleDateString()}
                categories={{
                  time: ["10 - 20 Minuten"],
                  type: ["Vegetarisch"]
                }}
                attachements={[{ dataUrl: "", name: "", size: 123 }]}
                ingredients="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam"
                description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Navigate to={PATHS.recipeEdit(rezept)}>
                <Button>Bearbeiten</Button>
              </Navigate>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
      </div>

      <Box margin={1}>
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
      </Box>
    </Box>
  );
};
