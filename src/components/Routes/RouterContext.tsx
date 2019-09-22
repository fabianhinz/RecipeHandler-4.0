import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

export const RouterContext = React.createContext<RouteComponentProps | null>(null);

export const RouterProvider = withRouter(({ children, ...routerProps }) => (
    <RouterContext.Provider value={routerProps}>{children}</RouterContext.Provider>
));
