import React, { FC } from "react";
import { Navigate } from "../../Routes/Navigate";
import { PATHS } from "../../Routes/Routes";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import BrightnessIcon from "@material-ui/icons/SettingsBrightnessTwoTone";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import AccountIcon from "@material-ui/icons/AccountCircleTwoTone";
import { HeaderDispatch } from "./HeaderReducer";
import { useFirebaseAuthContext } from "../../Provider/FirebaseAuthProvider";
import { makeStyles, createStyles } from "@material-ui/styles";
import clsx from "clsx";

interface HeaderNavigationProps extends HeaderDispatch {
    drawerRight: boolean;
    onThemeChange: () => void;
}

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        },
        drawerRight: {
            flexDirection: "column"
        }
    })
);

export const HeaderNavigation: FC<HeaderNavigationProps> = ({
    onThemeChange,
    dispatch,
    drawerRight
}) => {
    const { user } = useFirebaseAuthContext();
    const classes = useStyles();

    return (
        <div className={clsx(classes.container, drawerRight && classes.drawerRight)}>
            <Navigate to={PATHS.home}>
                <IconButton>
                    <HomeIcon />
                </IconButton>
            </Navigate>

            <IconButton onClick={onThemeChange}>
                <BrightnessIcon />
            </IconButton>

            {user && (
                <Navigate to={PATHS.recipeCreate}>
                    <IconButton>
                        <AddIcon />
                    </IconButton>
                </Navigate>
            )}

            <IconButton onClick={() => dispatch({ type: "dialogChange" })}>
                <AccountIcon />
            </IconButton>
        </div>
    );
};
