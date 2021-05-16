import React, { FC, FunctionComponent, lazy, LazyExoticComponent, Suspense, SVGProps } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'

import { ReactComponent as AccountIcon } from '../../icons/account.svg'
import { ReactComponent as BookmarksIcon } from '../../icons/bookmarks.svg'
import { ReactComponent as DetailsIcon } from '../../icons/details.svg'
import { ReactComponent as EditIcon } from '../../icons/edit.svg'
import { ReactComponent as ExpensesIcon } from '../../icons/expenses.svg'
import { ReactComponent as HomeIcon } from '../../icons/home.svg'
import { ReactComponent as ImpressumIcon } from '../../icons/impressum.svg'
import { ReactComponent as SearchIcon } from '../../icons/search.svg'
import { ReactComponent as ShoppingCardIcon } from '../../icons/shopping.svg'
import { ReactComponent as TrialsIcon } from '../../icons/trial.svg'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { Background } from '../Shared/Background'
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
    searchResults: '/searchResults',
    cookingHistory: '/cookingHistory',
    expenses: '/expenses',
}

interface AppRoute {
    path: string
    Component: LazyExoticComponent<FC<RouteComponentProps<any>>>
    BackgroundIcon: FunctionComponent<SVGProps<SVGSVGElement>>
}

const anonymousRoutes: AppRoute[] = [
    {
        path: PATHS.home,
        Component: lazy(() => import('../Home/Home')),
        BackgroundIcon: HomeIcon,
    },
    {
        path: PATHS.details(),
        Component: lazy(() => import('../Recipe/Details/RecipeDetails')),
        BackgroundIcon: DetailsIcon,
    },
    {
        path: PATHS.trials,
        Component: lazy(() => import('../Trials/Trials')),
        BackgroundIcon: TrialsIcon,
    },
    {
        path: PATHS.bookmarks,
        Component: lazy(() => import('../Bookmarks/Bookmarks')),
        BackgroundIcon: BookmarksIcon,
    },
    {
        path: PATHS.impressum,
        Component: lazy(() => import('../Impressum/Impressum')),
        BackgroundIcon: ImpressumIcon,
    },
    {
        path: PATHS.searchResults,
        Component: lazy(() => import('../Search/SearchResults')),
        BackgroundIcon: SearchIcon,
    },
]

const securedRoutes: AppRoute[] = [
    {
        path: PATHS.recipeCreate,
        Component: lazy(() => import('../Recipe/Create/RecipeCreate')),
        BackgroundIcon: EditIcon,
    },
    {
        path: PATHS.recipeEdit(),
        Component: lazy(() => import('../Recipe/Edit/RecipeEdit')),
        BackgroundIcon: EditIcon,
    },
    {
        path: PATHS.account,
        Component: lazy(() => import('../Account/AccountUser/AccountUser')),
        BackgroundIcon: AccountIcon,
    },
    {
        path: PATHS.shoppingList,
        Component: lazy(() => import('../Account/AccountShoppingList')),
        BackgroundIcon: ShoppingCardIcon,
    },
    {
        path: PATHS.cookingHistory,
        Component: lazy(() => import('../Account/AccountCookingHistory')),
        BackgroundIcon: HomeIcon,
    },
    {
        path: PATHS.expenses,
        Component: lazy(() => import('../Expenses/Expenses')),
        BackgroundIcon: ExpensesIcon,
    },
]

const renderRoute = ({ path, Component, BackgroundIcon }: AppRoute) => (
    <Route
        key={path}
        path={path}
        exact
        render={routeProps => (
            <Suspense fallback={<Progress variant="fixed" />}>
                <Component {...routeProps} />
                <Background Icon={BackgroundIcon} />
            </Suspense>
        )}
    />
)

export const Routes: FC = () => {
    const { user, loginEnabled } = useFirebaseAuthContext()

    return (
        <Switch>
            {anonymousRoutes.map(renderRoute)}
            {user && securedRoutes.map(renderRoute)}
            {loginEnabled && <Route render={() => <Redirect to="/" />} />}
        </Switch>
    )
}
