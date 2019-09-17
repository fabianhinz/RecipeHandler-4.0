import FavoriteIcon from "@material-ui/icons/FavoriteTwoTone";
import React, { FC } from "react";
import {
    createStyles,
    Grid,
    makeStyles,
    Typography
    } from "@material-ui/core";

const useStyles = makeStyles(theme =>
    createStyles({
        footer: {
            position: "fixed",
            bottom: theme.spacing(1),
            right: 0,
            left: 0,
            zIndex: -1,
            fontWeight: theme.typography.fontWeightLight
        },
        favIcon: {
            margin: theme.spacing(0.5)
        }
    })
);

export const Footer: FC = () => {
    const classes = useStyles();

    return (
        <Typography className={classes.footer} variant="button">
            <Grid container alignItems="center" justify="center">
                made with <FavoriteIcon className={classes.favIcon} fontSize="small" />
                in Hamburg
      </Grid>
        </Typography>
    );
};
