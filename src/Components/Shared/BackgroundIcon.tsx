import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>
    createStyles({
        backgroundContainer: {
            display: "flex",
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
            [theme.breakpoints.up("lg")]: {
                width: 400
            }
        }
    })
);

interface BackgroundIconProps {
    Icon: FC<React.SVGProps<SVGSVGElement>>;
}

export const BackgroundIcon: FC<BackgroundIconProps> = ({ Icon }) => {
    const classes = useStyles();

    return (
        <div className={classes.backgroundContainer}>
            <Icon className={classes.icon} />
        </div>
    );
};
