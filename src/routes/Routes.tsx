import React, { FC, Suspense, lazy, LazyExoticComponent } from "react";
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import { PathBackground } from "../util/BackgroundIcon";

interface Routes {
  path: string;
  Component: LazyExoticComponent<FC<RouteComponentProps<any>>>;
  fallback: JSX.Element;
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
    fallback: <div>...startseite lädt</div>
  },
  {
    path: PATHS.recipeCreate,
    Component: lazy(() => import("../components/recipe/create/RecipeCreate")),
    fallback: <div>...rezeptCreate lädt</div>
  },
  {
    path: PATHS.recipeDetails(),
    Component: lazy(() => import("../components/recipe/details/RecipeDetails")),
    fallback: <div>...rezeptDetails lädt</div>
  },
  {
    path: PATHS.recipeEdit(),
    Component: lazy(() => import("../components/recipe/edit/RecipeEdit")),
    fallback: <div>...RezeptEdit lädt</div>
  }
];

export const Routes: FC = () => (
  <Switch>
    {routes.map(({ path, Component, fallback }) => (
      <Route
        key={path}
        path={path}
        exact
        render={routeProps => (
          <Suspense fallback={fallback}>
            <Component {...routeProps} />
            <PathBackground {...routeProps} />
          </Suspense>
        )}
      />
    ))}
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);
