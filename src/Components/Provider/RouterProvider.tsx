import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";

const Context = React.createContext<RouteComponentProps | null>(null);

export const useRouterContext = () => useContext(Context) as RouteComponentProps;

export const RouterProvider = withRouter(({ children, ...routerProps }) => (
    <Context.Provider value={routerProps}>{children}</Context.Provider>
));
