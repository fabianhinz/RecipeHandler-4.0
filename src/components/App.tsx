import React, { FC, lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router";

const Startseite = lazy(() => import("./startseite/Startseite"));
const RezeptCreate = lazy(() => import("./rezept/create/RezeptCreate"));
const RezeptDetails = lazy(() => import("./rezept/details/RezeptDetails"));
const RezeptEdit = lazy(() => import("./rezept/edit/RezeptEdit"));

const App: FC = () => (
  <Switch>
    <Route
      path="/"
      exact
      render={routeProps => (
        <Suspense fallback={<div>...loading</div>}>
          <Startseite {...routeProps} />
        </Suspense>
      )}
    />
    <Route
      path="/create"
      exact
      render={routeProps => (
        <Suspense fallback={<div>...loading</div>}>
          <RezeptCreate {...routeProps} />
        </Suspense>
      )}
    />
    <Route
      path="/details/:id"
      exact
      render={routeProps => (
        <Suspense fallback={<div>...loading</div>}>
          <RezeptDetails {...routeProps} />
        </Suspense>
      )}
    />
    <Route
      path="/edit/:id"
      exact
      render={routeProps => (
        <Suspense fallback={<div>...loading</div>}>
          <RezeptEdit {...routeProps} />
        </Suspense>
      )}
    />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);

export default App;
