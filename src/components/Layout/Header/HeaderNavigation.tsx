import React, { FC } from "react";
import { Navigate } from "../../Routes/Navigate";
import { PATHS } from "../../Routes/Routes";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import BrightnessIcon from "@material-ui/icons/SettingsBrightnessTwoTone";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import AccountIcon from "@material-ui/icons/AccountCircleTwoTone";

interface HeaderNavigationProps {
    onThemeChange: () => void;
    onDrawerChange: () => void;
}

export const HeaderNavigation: FC<HeaderNavigationProps> = props => (
    <>
        <Navigate to={PATHS.home}>
            <IconButton>
                <HomeIcon />
            </IconButton>
        </Navigate>
        <IconButton onClick={props.onThemeChange}>
            <BrightnessIcon />
        </IconButton>
        <Navigate to={PATHS.recipeCreate}>
            <IconButton>
                <AddIcon />
            </IconButton>
        </Navigate>
        <IconButton onClick={props.onDrawerChange}>
            <AccountIcon />
        </IconButton>
    </>
);
