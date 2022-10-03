import { createContext, useContext } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

const Context = createContext<RouteComponentProps | null>(null)

export const useRouterContext = () => useContext(Context) as RouteComponentProps

const RouterProvider = withRouter(({ children, ...routerProps }) => (
    <Context.Provider value={routerProps}>{children}</Context.Provider>
))

export default RouterProvider
