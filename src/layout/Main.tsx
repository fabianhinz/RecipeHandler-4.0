import React, { FC } from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import { Routes } from "../routes/Routes";

const useStyles = makeStyles(theme =>
  createStyles({
    main: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3)
    }
  })
);

export const Main: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Routes />
    </div>
  );
};
