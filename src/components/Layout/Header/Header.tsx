import OpenDrawerIcon from "@material-ui/icons/KeyboardArrowUpTwoTone";
import React, { FC } from "react";
import {
    Box,
    createStyles,
    Fab,
    Grid,
    Hidden,
    makeStyles,
    Paper,
    SwipeableDrawer
} from "@material-ui/core";

import { HeaderNavigation } from "./HeaderNavigation";
import { useHeaderReducer } from "./HeaderReducer";
import { HeaderLoginDialog } from "./HeaderLoginDialog";

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
    onThemeChange: () => void;
}

export const Header: FC<HeaderProps> = props => {
    const { state, dispatch } = useHeaderReducer();
    const classes = useStyles();

    const handleDrawerChange = () => dispatch({ type: "drawerChange" });

    return (
        <>
            <Hidden mdDown>
                <Paper className={classes.paper}>
                    <Box display="flex" flexDirection="column" onClick={handleDrawerChange}>
                        <HeaderNavigation
                            onDrawerChange={handleDrawerChange}
                            onThemeChange={props.onThemeChange}
                        />
                    </Box>
                </Paper>
            </Hidden>

            <Hidden lgUp>
                <SwipeableDrawer
                    anchor="bottom"
                    open={state.drawer}
                    onClose={handleDrawerChange}
                    onOpen={handleDrawerChange}
                >
                    <Grid container justify="space-evenly">
                        <HeaderNavigation
                            onDrawerChange={handleDrawerChange}
                            onThemeChange={props.onThemeChange}
                        />
                    </Grid>
                </SwipeableDrawer>
                {!state.drawer && (
                    <Fab
                        size="small"
                        className={classes.openDrawerIcon}
                        onClick={handleDrawerChange}
                    >
                        <OpenDrawerIcon />
                    </Fab>
                )}
            </Hidden>

            <HeaderLoginDialog
                currentUser={state.currentUser}
                dialog={state.dialog}
                email={state.email}
                password={state.password}
                dispatch={dispatch}
            />
        </>
    );
};
