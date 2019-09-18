import blueGrey from "@material-ui/core/colors/blueGrey";
import FavoriteIcon from "@material-ui/icons/FavoriteTwoTone";
import React, { FC, useState } from "react";
import { Badge, createStyles, IconButton, makeStyles } from "@material-ui/core/";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

const useStyles = makeStyles(theme => {
    const background = theme.palette.type === "light" ? blueGrey[900] : theme.palette.grey[600];

    return createStyles({
        badge: {
            background,
            color: theme.palette.getContrastText(background)
        }
    });
});

export const BadgeRating: FC<Pick<SvgIconProps, "fontSize">> = ({ fontSize }) => {
    const [rating, setRating] = useState(0);
    const classes = useStyles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setRating(previous => ++previous);
    };

    return (
        <IconButton disableRipple onClick={handleClick}>
            <Badge classes={classes} badgeContent={rating} max={100}>
                <FavoriteIcon fontSize={fontSize} color="error" />
            </Badge>
        </IconButton>
    );
};
