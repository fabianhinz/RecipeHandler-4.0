import React, { FC, Suspense, lazy, LazyExoticComponent } from "react";
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as AttachementIcon } from "../icons/attachement.svg";
import { BackgroundIcon } from "../util/BackgroundIcon";

interface Routes {
  path: string;
  Component: LazyExoticComponent<FC<RouteComponentProps<any>>>;
  fallback: JSX.Element;
  background: JSX.Element;
}

export const PATHS = {
  home: "/",
  recipeCreate: "/recipe/create",
  recipeDetails: (id = ":id") => `/recipe/${id}`,
  recipeEdit: (id = ":id") => `/recipe/edit/${id}`
};

const routes: Routes[] = [
  {
    path: PATHS.home,
    Component: lazy(() => import("../components/home/Home")),
    fallback: <div>...startseite lädt</div>,
    background: <BackgroundIcon Icon={HomeIcon} />
  },
  {
    path: PATHS.recipeCreate,
    Component: lazy(() => import("../components/recipe/create/RecipeCreate")),
    fallback: <div>...rezeptCreate lädt</div>,
    background: <BackgroundIcon Icon={AttachementIcon} />
  },
  {
    path: PATHS.recipeDetails(),
    Component: lazy(() => import("../components/recipe/details/RecipeDetails")),
    fallback: <div>...rezeptDetails lädt</div>,
    background: <BackgroundIcon Icon={HomeIcon} />
  },
  {
    path: PATHS.recipeEdit(),
    Component: lazy(() => import("../components/recipe/edit/RecipeEdit")),
    fallback: <div>...RezeptEdit lädt</div>,
    background: <BackgroundIcon Icon={HomeIcon} />
  }
];

export const Routes: FC = () => (
  <Switch>
    {routes.map(({ path, Component, fallback, background }) => (
      <Route
        key={path}
        path={path}
        exact
        render={routeProps => (
          <Suspense fallback={fallback}>
            <Component {...routeProps} />
            {background}
          </Suspense>
        )}
      />
    ))}
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);
