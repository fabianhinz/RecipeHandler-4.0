import { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { RouterContext } from "../Components/Routes/RouterContext";

export const useRouter = () => useContext(RouterContext) as RouteComponentProps;
