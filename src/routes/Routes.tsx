import React, { FC, Suspense, lazy, LazyExoticComponent } from "react";
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as AttachementIcon } from "../icons/attachement.svg";
import { BackgroundIcon } from "../util/BackgroundIcon";

interface Routes {
  path: string;
  Component: LazyExoticComponent<FC<RouteComponentProps<any>>>;
  Background: (props: { loading: boolean }) => JSX.Element;
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
    path: PATHS.recipeDetails(),
    Component: lazy(() => import("../components/recipe/details/RecipeDetails")),
    Background: props => (
      <BackgroundIcon Icon={HomeIcon} loading={props.loading} />
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
