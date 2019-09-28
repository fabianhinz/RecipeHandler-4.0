import React, { FC } from "react";
import { Drawer } from "@material-ui/core";
import { HeaderNavigation } from "./HeaderNavigation";
import { useHeaderReducer } from "./HeaderReducer";
import { HeaderLoginDialog } from "./HeaderLoginDialog";
import { useBreakpointsContext } from "../../Provider/BreakpointsProvider";

interface HeaderProps {
    onThemeChange: () => void;
}

export const Header: FC<HeaderProps> = props => {
    const { state, dispatch } = useHeaderReducer();
    const { isDrawerBottom } = useBreakpointsContext();
    const handleDrawerChange = () => dispatch({ type: "drawerChange" });

    return (
        <>
            <Drawer
                variant="permanent"
                anchor={isDrawerBottom ? "bottom" : "right"}
                open={state.drawer}
                onClose={handleDrawerChange}
            >
                <HeaderNavigation
                    drawerRight={!isDrawerBottom}
                    dispatch={dispatch}
                    onThemeChange={props.onThemeChange}
                />
            </Drawer>

            <HeaderLoginDialog
                dialog={state.dialog}
                email={state.email}
                password={state.password}
                dispatch={dispatch}
            />
        </>
    );
};
