import React, {
    FC,
    lazy,
    LazyExoticComponent,
    Suspense
    } from "react";
import { BackgroundIcon } from "../util/BackgroundIcon";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as AttachementIcon } from "../icons/attachement.svg";
import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch
    } from "react-router-dom";

interface Routes {
    path: string;
    Component: LazyExoticComponent<FC<RouteComponentProps<any>>>;
    Background: (props: { loading: boolean }) => JSX.Element;
}

export const PATHS = {
    home: "/",
    recipeCreate: "/recipe/create",
    recipeEdit: (id = ":id") => `/recipe/edit/${id}`
};

const routes: Routes[] = [
    {
        path: PATHS.home,
        Component: lazy(() => import("../components/home/Home")),
        Background: props => (
            <BackgroundIcon Icon={HomeIcon} loading={props.loading} />
        )
    },
    {
        path: PATHS.recipeCreate,
        Component: lazy(() => import("../components/recipe/create/RecipeCreate")),
        Background: props => (
            <BackgroundIcon Icon={AttachementIcon} loading={props.loading} />
        )
    },
    {
        path: PATHS.recipeEdit(),
        Component: lazy(() => import("../components/recipe/edit/RecipeEdit")),
        Background: props => (
            <BackgroundIcon Icon={HomeIcon} loading={props.loading} />
        )
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
