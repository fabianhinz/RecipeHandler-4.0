import React, { FC } from "react";
import { Navigate } from "../../Routes/Navigate";
import { PATHS } from "../../Routes/Routes";
import { IconButton, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import BrightnessIcon from "@material-ui/icons/SettingsBrightnessTwoTone";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import AccountIcon from "@material-ui/icons/AccountCircleTwoTone";
import { HeaderDispatch } from "./HeaderReducer";

interface HeaderNavigationProps extends HeaderDispatch {
    onThemeChange: () => void;
}

export const HeaderNavigation: FC<HeaderNavigationProps> = ({ onThemeChange, dispatch }) => (
    <Box display="flex" flexDirection="column" onClick={() => dispatch({ type: "drawerChange" })}>
        <Navigate to={PATHS.home}>
            <IconButton>
                <HomeIcon />
            </IconButton>
        </Navigate>
        <IconButton onClick={onThemeChange}>
            <BrightnessIcon />
        </IconButton>
        <Navigate to={PATHS.recipeCreate}>
            <IconButton>
                <AddIcon />
            </IconButton>
        </Navigate>
        <IconButton onClick={() => dispatch({ type: "dialogChange" })}>
            <AccountIcon />
        </IconButton>
    </Box>
);
