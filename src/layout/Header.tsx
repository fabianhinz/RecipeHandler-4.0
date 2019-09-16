import React, { FC, useState } from "react";
import {
  Grid,
  IconButton,
  Paper,
  makeStyles,
  createStyles,
  PaletteType,
  Divider,
  Hidden,
  SwipeableDrawer,
  Fab
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/FindInPageTwoTone";
import SettingsIcon from "@material-ui/icons/SettingsTwoTone";
import BrightnessIcon from "@material-ui/icons/SettingsBrightnessTwoTone";
import OpenDrawerIcon from "@material-ui/icons/KeyboardArrowUpTwoTone";
import CreateIcon from "@material-ui/icons/CreateTwoTone";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import { Navigate } from "../routes/Navigate";
import { PATHS } from "../routes/Routes";

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      borderRadius: "0 0 10px 10px",
      position: "fixed",
      right: 0,
      top: 0,
      zIndex: theme.zIndex.appBar,
      padding: theme.spacing(1)
    },
    divider: {
      margin: theme.spacing(1)
    },
    openDrawerIcon: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: theme.zIndex.drawer + 1
    }
  })
);

interface HeaderProps {
  onThemeToggle: () => void;
  themeType: PaletteType;
}

export const Header: FC<HeaderProps> = props => {
  const [drawer, setDrawer] = useState(false);
  const classes = useStyles();

  return (
    <>
      <Hidden mdDown>
        <Paper className={classes.paper}>
          <Navigate to={PATHS.home}>
            <IconButton>
              <HomeIcon />
            </IconButton>
          </Navigate>
          <Divider className={classes.divider} />
          <IconButton onClick={props.onThemeToggle}>
            <BrightnessIcon />
          </IconButton>
          <Divider className={classes.divider} />
          <Navigate to={PATHS.recipeCreate}>
            <IconButton>
              <CreateIcon />
            </IconButton>
          </Navigate>
        </Paper>
      </Hidden>
      <Hidden lgUp>
        <SwipeableDrawer
          anchor="bottom"
          open={drawer}
          onClose={() => setDrawer(false)}
          onOpen={() => setDrawer(true)}
        >
          <Grid direction="row" container justify="space-evenly">
            <Navigate to={PATHS.home}>
              <IconButton>
                <HomeIcon />
              </IconButton>
            </Navigate>
            <IconButton onClick={props.onThemeToggle}>
              <BrightnessIcon />
            </IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <IconButton>
              <CreateIcon />
            </IconButton>
          </Grid>
        </SwipeableDrawer>
        {!drawer && (
          <Fab
            size="small"
            className={classes.openDrawerIcon}
            onClick={() => setDrawer(true)}
          >
            <OpenDrawerIcon />
          </Fab>
        )}
      </Hidden>
    </>
  );
};
