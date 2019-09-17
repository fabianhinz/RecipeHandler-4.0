import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import BrightnessIcon from "@material-ui/icons/SettingsBrightnessTwoTone";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import OpenDrawerIcon from "@material-ui/icons/KeyboardArrowUpTwoTone";
import React, { FC, useState } from "react";
import {
    Box,
    createStyles,
    Fab,
    Grid,
    Hidden,
    IconButton,
    makeStyles,
    PaletteType,
    Paper,
    SwipeableDrawer
    } from "@material-ui/core";
import { Navigate } from "../routes/Navigate";
import { PATHS } from "../routes/Routes";

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            borderRadius: "0 0 10px 10px",
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: theme.zIndex.appBar,
            padding: theme.spacing(1)
        },
        openDrawerIcon: {
            position: "fixed",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            zIndex: theme.zIndex.drawer + 1
        }
    })
);

interface HeaderProps {
    onThemeToggle: () => void;
    themeType: PaletteType;
}

export const Header: FC<HeaderProps> = props => {
    const [drawer, setDrawer] = useState(false);
    const classes = useStyles();

    const navigationElements = (
        <>
            <Navigate to={PATHS.home}>
                <IconButton>
                    <HomeIcon />
                </IconButton>
            </Navigate>
            <IconButton onClick={props.onThemeToggle}>
                <BrightnessIcon />
            </IconButton>
            <Navigate to={PATHS.recipeCreate}>
                <IconButton>
                    <AddIcon />
                </IconButton>
            </Navigate>
        </>
    );

    return (
        <>
            <Hidden mdDown>
                <Paper className={classes.paper}>
                    <Box display="flex" flexDirection="column">
                        {navigationElements}
                    </Box>
                </Paper>
            </Hidden>
            <Hidden lgUp>
                <SwipeableDrawer
                    anchor="bottom"
                    open={drawer}
                    onClose={() => setDrawer(false)}
                    onOpen={() => setDrawer(true)}
                >
                    <Grid container justify="space-evenly">
                        {navigationElements}
                    </Grid>
                </SwipeableDrawer>
                {!drawer && (
                    <Fab
                        size="small"
                        className={classes.openDrawerIcon}
                        onClick={() => setDrawer(true)}
                    >
                        <OpenDrawerIcon />
                    </Fab>
                )}
            </Hidden>
        </>
    );
};
