import blueGrey from "@material-ui/core/colors/blueGrey";
import FavoriteIcon from "@material-ui/icons/FavoriteTwoTone";
import React, { FC, useState, useEffect } from "react";
import { Badge, createStyles, IconButton, makeStyles } from "@material-ui/core/";
import { Recipe, AttachementMetadata } from "../../model/model";
import { FirebaseService } from "../../firebase";

export const useBadgeStyles = makeStyles(theme => {
    const background = theme.palette.type === "light" ? blueGrey[900] : theme.palette.grey[600];

    return createStyles({
        badge: {
            background,
            color: theme.palette.getContrastText(background)
        }
    });
});

export const BadgeRating: FC<Pick<Recipe<AttachementMetadata>, "name">> = ({ name }) => {
    const [rating, setRating] = useState(0);
    const classes = useBadgeStyles();

    useEffect(() => {
        return FirebaseService.firestore
            .collection("rating")
            .doc(name)
            .onSnapshot(documentSnapshot =>
                setRating(documentSnapshot.exists ? documentSnapshot.data()!.value : 0)
            );
    }, [name]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        FirebaseService.firestore
            .collection("rating")
            .doc(name)
            .update({ value: FirebaseService.incrementBy(1) })
            .catch(error => console.error(error));
    };

    return (
        <IconButton disableRipple onClick={handleClick}>
            <Badge classes={classes} badgeContent={rating} max={100}>
                <FavoriteIcon color="error" />
            </Badge>
        </IconButton>
    );
};
