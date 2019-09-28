import React, { useContext, FC } from "react";
import { useMediaQuery } from "@material-ui/core";

type Breakpoints = {
    isDrawerBottom: boolean;
    isDraggableRecipes: boolean;
    isDialogFullscreen: boolean;
    isMobile: boolean;
};

const Context = React.createContext<Breakpoints | null>(null);

export const useBreakpointsContext = () => useContext(Context) as Breakpoints;

export const BreakpointsProvider: FC = ({ children }) => {
    const isDrawerBottom = useMediaQuery("(max-width: 1400px)");
    const isDraggableRecipes = useMediaQuery("(min-width: 768px)");
    const isDialogFullscreen = useMediaQuery("(max-width: 768px)");
    const isMobile = useMediaQuery("(max-width: 599px)");

    return (
        <Context.Provider
            value={{ isDrawerBottom, isDraggableRecipes, isDialogFullscreen, isMobile }}
        >
            {children}
        </Context.Provider>
    );
};
