import OpenDrawerIcon from "@material-ui/icons/MenuTwoTone";
import React, { FC } from "react";
import { createStyles, Fab, Hidden, makeStyles, Paper, SwipeableDrawer } from "@material-ui/core";

import { HeaderNavigation } from "./HeaderNavigation";
import { useHeaderReducer } from "./HeaderReducer";
import { HeaderLoginDialog } from "./HeaderLoginDialog";
import { BORDER_RADIUS } from "../../../theme";

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            borderRadius: `0px 0px ${BORDER_RADIUS}px ${BORDER_RADIUS}px`,
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: theme.zIndex.appBar,
            padding: theme.spacing(1)
        },
        openDrawerIcon: {
            position: "fixed",
            top: theme.spacing(1),
            right: theme.spacing(1),
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
                    <HeaderNavigation dispatch={dispatch} onThemeChange={props.onThemeChange} />
                </Paper>
            </Hidden>

            <Hidden lgUp>
                <SwipeableDrawer
                    disableBackdropTransition
                    anchor="right"
                    open={state.drawer}
                    onClose={handleDrawerChange}
                    onOpen={handleDrawerChange}
                >
                    <HeaderNavigation dispatch={dispatch} onThemeChange={props.onThemeChange} />
                </SwipeableDrawer>
                <Fab size="small" className={classes.openDrawerIcon} onClick={handleDrawerChange}>
                    <OpenDrawerIcon />
                </Fab>
            </Hidden>

            <HeaderLoginDialog
                dialog={state.dialog}
                email={state.email}
                password={state.password}
                dispatch={dispatch}
            />
        </>
    );
};
