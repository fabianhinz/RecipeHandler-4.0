import React, { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as AttachementIcon } from "../../icons/attachement.svg";
import { BackgroundIcon } from "../Shared/BackgroundIcon";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";

export const PATHS = {
    home: "/",
    recipeCreate: "/recipe/create",
    recipeEdit: (id = ":id") => `/recipe/edit/${id}`
};

interface Routes {
    path: string;
    Component: LazyExoticComponent<FC<RouteComponentProps<any>>>;
    Background: (props: { loading: boolean }) => JSX.Element;
}

const routes: Routes[] = [
    {
        path: PATHS.home,
        Component: lazy(() => import("../Home/Home")),
        Background: props => <BackgroundIcon Icon={HomeIcon} loading={props.loading} />
    },
    {
        path: PATHS.recipeCreate,
        Component: lazy(() => import("../Recipe/Create/RecipeCreate")),
        Background: props => <BackgroundIcon Icon={AttachementIcon} loading={props.loading} />
    },
    {
        path: PATHS.recipeEdit(),
        Component: lazy(() => import("../Recipe/Edit/RecipeEdit")),
        Background: props => <BackgroundIcon Icon={HomeIcon} loading={props.loading} />
    }
];

export const Routes: FC = () => (
    <Switch>
        {routes.map(({ path, Component, Background }) => (
            <Route
                key={path}
                path={path}
                exact
                render={routeProps => (
                    <Suspense fallback={<Background loading />}>
                        <Component {...routeProps} />
                        <Background loading={false} />
                    </Suspense>
                )}
            />
        ))}
        <Route render={() => <Redirect to="/" />} />
    </Switch>
);
