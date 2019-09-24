import React, { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as AttachementIcon } from "../../icons/attachement.svg";
import { BackgroundIcon } from "../Shared/BackgroundIcon";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Loading } from "../Shared/Loading";

export const PATHS = {
    home: "/",
    details: (name = ":name") => `/recipe/details/${name}`,
    recipeCreate: "/recipe/create",
    recipeEdit: (name = ":name") => `/recipe/edit/${name}`
};

interface Routes {
    path: string;
    Component: LazyExoticComponent<FC<RouteComponentProps<any>>>;
    Background: JSX.Element;
}

const routes: Routes[] = [
    {
        path: PATHS.home,
        Component: lazy(() => import("../Home/Home")),
        Background: <BackgroundIcon Icon={HomeIcon} />
    },
    {
        path: PATHS.details(),
        Component: lazy(() => import("../Recipe/Details/RecipeDetails")),
        Background: <BackgroundIcon Icon={HomeIcon} />
    },
    {
        path: PATHS.recipeCreate,
        Component: lazy(() => import("../Recipe/Create/RecipeCreate")),
        Background: <BackgroundIcon Icon={AttachementIcon} />
    },
    {
        path: PATHS.recipeEdit(),
        Component: lazy(() => import("../Recipe/Edit/RecipeEdit")),
        Background: <BackgroundIcon Icon={HomeIcon} />
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
                    <Suspense fallback={<Loading />}>
                        <Component {...routeProps} />
                        {Background}
                    </Suspense>
                )}
            />
        ))}
        <Route render={() => <Redirect to="/" />} />
    </Switch>
);
