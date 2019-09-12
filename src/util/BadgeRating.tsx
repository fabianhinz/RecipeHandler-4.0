import React, { FC, useState } from "react";
import FavoriteIcon from "@material-ui/icons/FavoriteTwoTone";
import {
  Badge,
  makeStyles,
  createStyles,
  IconButton
} from "@material-ui/core/";
import blueGrey from "@material-ui/core/colors/blueGrey";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

const useStyles = makeStyles(theme => {
  const backgroundColor =
    theme.palette.type === "light" ? blueGrey[900] : "#fff";

  return createStyles({
    badge: {
      backgroundColor,
      color: theme.palette.getContrastText(backgroundColor)
    }
  });
});

export const BadgeRating: FC<Pick<SvgIconProps, "fontSize">> = ({
  fontSize
}) => {
  const [rating, setRating] = useState(0);
  const classes = useStyles();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
