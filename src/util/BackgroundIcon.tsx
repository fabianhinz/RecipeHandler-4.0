import React, { FC } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { createStyles, makeStyles } from "@material-ui/core";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as AttachementIcon } from "../icons/attachement.svg";
import { PATHS } from "../routes/Routes";

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

interface BackgroundIconProps {
  Icon: FC<React.SVGProps<SVGSVGElement>>;
}

const BackgroundIcon: FC<BackgroundIconProps> = ({ Icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.backgroundContainer}>
      <Icon className={classes.icon} />
    </div>
  );
};

export const PathBackground: FC<RouteComponentProps> = ({ location }) => {
  switch (location.pathname) {
    case PATHS.recipeCreate:
      return <BackgroundIcon Icon={AttachementIcon} />;
    default:
      return <BackgroundIcon Icon={HomeIcon} />;
  }
};

export default withRouter(PathBackground);
