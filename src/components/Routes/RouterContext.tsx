import React, { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";

const RouterContext = React.createContext<RouteComponentProps | null>(null);

export const useRouter = () => useContext(RouterContext) as RouteComponentProps;

export const RouterProvider = withRouter(({ children, ...routerProps }) => (
    <RouterContext.Provider value={routerProps}>{children}</RouterContext.Provider>
));
