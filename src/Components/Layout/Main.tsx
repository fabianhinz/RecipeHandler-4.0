import React from "react";
import { Routes } from "../Routes/Routes";
import { useBreakpointsContext } from "../Provider/BreakpointsProvider";
import { Box } from "@material-ui/core";

export const Main = () => {
    const { isDrawerBottom } = useBreakpointsContext();

    return (
        <Box marginTop={3} marginBottom={isDrawerBottom ? 9 : 3}>
            <Routes />
        </Box>
    );
};
