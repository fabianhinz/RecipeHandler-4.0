import React, { FC, lazy, LazyExoticComponent, Suspense } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import Progress from '../Shared/Progress'

export const PATHS = {
    home: '/',
    details: (name = ':name') => `/recipe/details/${name}`,
    recipeCreate: '/recipe/create',
    recipeEdit: (name = ':name') => `/recipe/edit/${name}`,
    trials: '/trials',
    account: '/account',
    bookmarks: '/bookmarks',
    impressum: '/impressum',
    shoppingList: '/shopping',
}

interface AppRoute {
    path: string
    Component: LazyExoticComponent<FC<RouteComponentProps<any>>>
}

const anonymousRoutes: AppRoute[] = [
    {
        path: PATHS.home,
        Component: lazy(() => import('../Home/Home')),
    },
    {
        path: PATHS.details(),
        Component: lazy(() => import('../Recipe/Details/RecipeDetails')),
    },
    {
        path: PATHS.trials,
        Component: lazy(() => import('../Trials/Trials')),
    },
    {
        path: PATHS.bookmarks,
        Component: lazy(() => import('../Bookmarks/Bookmarks')),
    },
    {
        path: PATHS.impressum,
        Component: lazy(() => import('../Impressum/Impressum')),
    },
]

const securedRoutes: AppRoute[] = [
    {
        path: PATHS.recipeCreate,
        Component: lazy(() => import('../Recipe/Create/RecipeCreate')),
    },
    {
        path: PATHS.recipeEdit(),
        Component: lazy(() => import('../Recipe/Edit/RecipeEdit')),
    },
    {
        path: PATHS.account,
        Component: lazy(() => import('../Account/AccountUser/AccountUser')),
    },
    {
        path: PATHS.shoppingList,
        Component: lazy(() => import('../Account/AccountShoppingList')),
    },
]

const renderRoute = ({ path, Component }: AppRoute) => (
    <Route
        key={path}
        path={path}
        exact
        render={routeProps => (
            <Suspense fallback={<Progress variant="fixed" />}>
                <Component {...routeProps} />
            </Suspense>
        )}
    />
)

export const Routes: FC = () => {
    const { user } = useFirebaseAuthContext()

    return (
        <Switch>
            {anonymousRoutes.map(renderRoute)}
            {user && securedRoutes.map(renderRoute)}
            <Route render={() => <Redirect to="/" />} />
        </Switch>
    )
}
