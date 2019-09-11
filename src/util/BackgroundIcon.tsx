import React, { FC } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { createStyles, makeStyles } from "@material-ui/core";
import { ReactComponent as StartseiteIcon } from "../icons/home.svg";

const useStyles = makeStyles(theme =>
  createStyles({
    backgroundContainer: {
      height: "100vh",
      display: "flex",
      justifyContent: "flex-star",
      alignItems: "flex-end",
      position: "fixed",
      right: theme.spacing(3),
      left: theme.spacing(3),
      bottom: theme.spacing(3),
      zIndex: -1
    },
    icon: {
      opacity: 0.8,
      [theme.breakpoints.down("sm")]: {
        display: "hidden"
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
  })
);
// ToDo foreach path a different background
export const BackgroundIcon: FC<RouteComponentProps> = props => {
  const classes = useStyles();

  return (
    <div className={classes.backgroundContainer}>
      <StartseiteIcon className={classes.icon} />
    </div>
  );
};

export default withRouter(BackgroundIcon);
