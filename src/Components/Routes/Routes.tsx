import React, { FC, lazy, LazyExoticComponent, Suspense } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'

import { ReactComponent as AccountIcon } from '../../icons/account.svg'
import { ReactComponent as CreateIcon } from '../../icons/create.svg'
import { ReactComponent as DetailsIcon } from '../../icons/details.svg'
import { ReactComponent as EditIcon } from '../../icons/edit.svg'
import { ReactComponent as HomeIcon } from '../../icons/home.svg'
import { ReactComponent as TrialIcon } from '../../icons/logo.svg'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { BackgroundIcon } from '../Shared/BackgroundIcon'
import Progress from '../Shared/Progress'

export const PATHS = {
    home: '/',
    details: (name = ':name') => `/recipe/details/${name}`,
    recipeCreate: '/recipe/create',
    recipeEdit: (name = ':name') => `/recipe/edit/${name}`,
    trials: '/trials',
    account: '/account',
}

interface AppRoute {
    path: string
    Component: LazyExoticComponent<FC<RouteComponentProps<any>>>
    Background: () => JSX.Element
}

const anonymousRoutes: AppRoute[] = [
    {
        path: PATHS.home,
        Component: lazy(() => import('../Home/Home')),
        Background: () => <BackgroundIcon Icon={HomeIcon} />,
    },
    {
        path: PATHS.details(),
        Component: lazy(() => import('../Recipe/Details/RecipeDetails')),
        Background: () => <BackgroundIcon Icon={DetailsIcon} />,
    },
    // {
    //     path: PATHS.trials,
    //     Component: lazy(() => import('')),
    //     Background: () => <BackgroundIcon Icon={TrialIcon} />,
    // },
]

const securedRoutes: AppRoute[] = [
    {
        path: PATHS.recipeCreate,
        Component: lazy(() => import('../Recipe/Create/RecipeCreate')),
        Background: () => <BackgroundIcon Icon={CreateIcon} />,
    },
    {
        path: PATHS.recipeEdit(),
        Component: lazy(() => import('../Recipe/Edit/RecipeEdit')),
        Background: () => <BackgroundIcon Icon={EditIcon} />,
    },
    {
        path: PATHS.account,
        Component: lazy(() => import('../Account/AccountUser')),
        Background: () => <BackgroundIcon Icon={AccountIcon} />,
    },
]

const renderRoute = ({ path, Component, Background }: AppRoute) => (
    <Route
        key={path}
        path={path}
        exact
        render={routeProps => (
            <Suspense fallback={<Progress variant="fixed" />}>
                <Component {...routeProps} />
                <Background />
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
