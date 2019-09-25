import blueGrey from "@material-ui/core/colors/blueGrey";
import React, { FC } from "react";
import { Badge, createStyles, makeStyles } from "@material-ui/core/";
import { BadgeProps } from "@material-ui/core/Badge";

const useStyles = makeStyles(theme => {
    const background = theme.palette.type === "light" ? blueGrey[900] : theme.palette.grey[600];

    return createStyles({
        badge: {
            background,
            color: theme.palette.getContrastText(background)
        }
    });
});

export const BadgeWrapper: FC<BadgeProps> = ({ children, badgeContent }) => {
    const classes = useStyles();

    return (
        <Badge classes={classes} badgeContent={badgeContent} max={100}>
            {children}
        </Badge>
    );
};
