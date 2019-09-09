import React, { FC, useState } from "react";
import {
  Grid,
  Typography,
  makeStyles,
  ButtonBase,
  createStyles,
  Container,
  IconButton,
  Fab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Chip,
  Fade,
  Box
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/SettingsTwoTone";
import SearchIcon from "@material-ui/icons/FindInPageTwoTone";
import AddIcon from "@material-ui/icons/AddTwoTone";
import clsx from "clsx";
import { ReactComponent as StartseiteIcon } from "../icons/startseite.svg";

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
        width: 300
      },
      [theme.breakpoints.only("md")]: {
        width: 400
      },
      [theme.breakpoints.up("lg")]: {
        width: 500
      }
    }
  });
});

const App: FC = () => {
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
      <Container maxWidth="lg" className={classes.headerContainer}>
        <Grid
          className={classes.headerGrid}
          container
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
                    <ButtonBase className={classes.buttonBase}>
                      <Chip
                        className={classes.chip}
                        label={
                          <Typography variant="button">{category}</Typography>
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
                      className={clsx(
                        classes.chip,
                        selectedCategories.has(category) && classes.chipSelected
                      )}
                      color="primary"
                      label={
                        <Typography variant="button">{category}</Typography>
                      }
                    />
                  </ButtonBase>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <div className={classes.marginTop}>
          <ExpansionPanel>
            <ExpansionPanelSummary>
              <Grid container justify="space-between" alignItems="center">
                <Typography>Pfannkuchen</Typography>

                <Chip label={new Date().toLocaleDateString()} />
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary>
              <Grid container justify="space-between" alignItems="center">
                <Typography>Pfannkuchen</Typography>

                <Chip label={new Date().toLocaleDateString()} />
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary>
              <Grid container justify="space-between" alignItems="center">
                <Typography>Pfannkuchen</Typography>

                <Chip label={new Date().toLocaleDateString()} />
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary>
              <Grid container justify="space-between" alignItems="center">
                <Typography>Pfannkuchen</Typography>

                <Chip label={new Date().toLocaleDateString()} />
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Container>

      <Container maxWidth="lg" className={classes.footerContainer}>
        <Fab color="secondary" variant="extended">
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

export default App;
