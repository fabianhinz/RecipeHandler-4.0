import AddIcon from "@material-ui/icons/AddTwoTone";
import RemoveIcon from "@material-ui/icons/RemoveTwoTone";
import clsx from "clsx";
import React, { FC, useState } from "react";
import SearchIcon from "@material-ui/icons/FindInPageTwoTone";
import SettingsIcon from "@material-ui/icons/SettingsTwoTone";
import FavoriteIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMoreTwoTone";
import LinkIcon from "@material-ui/icons/LinkTwoTone";
import {
  Box,
  ButtonBase,
  Chip,
  Container,
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  Typography,
  Avatar,
  ExpansionPanelActions,
  Button,
  Divider
} from "@material-ui/core";
import { ReactComponent as StartseiteIcon } from "../../icons/startseite.svg";
import { RouteComponentProps } from "react-router";

const useStyles = makeStyles(theme => {
  const { spacing, shadows, zIndex } = theme;

  return createStyles({
    headerContainer: {
      position: "fixed",
      top: 0,
      right: 0,
      left: 0,
      zIndex: zIndex.appBar
    },
    mainContainer: {
      marginTop: spacing(11),
      marginBottom: spacing(3)
    },
    headerGrid: {
      background: "white",
      borderRadius: "0 0 10px 10px",
      boxShadow: shadows[1]
    },
    buttonBase: {
      borderRadius: 16
    },
    chip: {
      cursor: "pointer"
    },
    chipSelected: {
      boxShadow: shadows[10]
    },
    marginTop: { marginTop: spacing(3) },
    marginDivider: { margin: spacing(1) },
    footerContainer: {
      display: "flex",
      justifyContent: "flex-end",
      position: "fixed",
      bottom: spacing(3),
      right: 0,
      left: 0
    },
    box: {
      height: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      right: theme.spacing(3),
      left: theme.spacing(3),
      bottom: theme.spacing(3),
      zIndex: -1
    },
    icon: {
      opacity: 0.6,
      [theme.breakpoints.down("sm")]: {
        width: 200
      },
      [theme.breakpoints.only("md")]: {
        width: 300
      },
      [theme.breakpoints.only("lg")]: {
        width: 400
      },
      [theme.breakpoints.up("xl")]: {
        width: 500
      }
    }
  });
});

const Startseite: FC<RouteComponentProps> = props => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const classes = useStyles();

  const handleCategoryClick = (category: string) => () => {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    setSelectedCategories(new Set(selectedCategories));
  };

  return (
    <>
      <Container maxWidth="lg" className={clsx(classes.headerContainer)}>
        <Grid
          container
          className={classes.headerGrid}
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <IconButton>
            <SettingsIcon fontSize="large" />
          </IconButton>
          <Typography variant="h4">Rezepte</Typography>
          <IconButton>
            <SearchIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Container>

      <Container maxWidth="lg" className={classes.mainContainer}>
        <Grid direction="column" container spacing={4}>
          <Grid item>
            <Typography gutterBottom variant="h5">
              zuletzt hinzugefügt
            </Typography>
            <Grid container spacing={2}>
              {["Pfannkuchen", "Salat mit Pute", "herzhafte Muffins"].map(
                category => (
                  <Grid item key={category}>
                    <ButtonBase
                      className={classes.buttonBase}
                      onClick={() => props.history.push(`/details/${category}`)}
                    >
                      <Chip
                        avatar={
                          <Avatar>
                            <LinkIcon />
                          </Avatar>
                        }
                        className={classes.chip}
                        label={
                          <Typography variant="subtitle2">
                            {category}
                          </Typography>
                        }
                      />
                    </ButtonBase>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>

          <Grid item>
            <Typography gutterBottom variant="h5">
              Kategorien
            </Typography>
            <Grid container spacing={2}>
              {["Salat", "Fleisch", "vegetarisch"].map(category => (
                <Grid item key={category}>
                  <ButtonBase
                    className={classes.buttonBase}
                    onClick={handleCategoryClick(category)}
                  >
                    <Chip
                      avatar={
                        <Avatar>
                          {selectedCategories.has(category) ? (
                            <RemoveIcon />
                          ) : (
                            <AddIcon />
                          )}
                        </Avatar>
                      }
                      className={clsx(classes.chip)}
                      color={
                        selectedCategories.has(category) ? "primary" : "default"
                      }
                      label={
                        <Typography variant="subtitle2">{category}</Typography>
                      }
                    />
                  </ButtonBase>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <div className={classes.marginTop}>
          {["Pfannkuchen", "Salat mit Pute", "herzhafte Muffins"].map(
            rezept => (
              <ExpansionPanel key={rezept}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography display="inline">{rezept}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container direction="column" spacing={2}>
                    <Grid item container spacing={1}>
                      <Grid item>
                        <Chip label={new Date().toLocaleDateString()} />
                      </Grid>
                      <Grid item>
                        <Chip label={<FavoriteIcon />} />
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography>ToDo Bild</Typography>
                    </Grid>

                    <Grid item>
                      <Typography>ToDo Kurzbeschreibung</Typography>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                  <Button>Details</Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            )
          )}
        </div>
      </Container>

      <Container maxWidth="lg" className={classes.footerContainer}>
        <Fab
          color="secondary"
          variant="extended"
          onClick={() => props.history.push("/create")}
        >
          <AddIcon /> anlegen
        </Fab>
      </Container>

      <Fade in timeout={800}>
        <Box className={classes.box}>
          <div className={classes.icon}>
            <StartseiteIcon />
          </div>
        </Box>
      </Fade>
    </>
  );
};

export default Startseite;
