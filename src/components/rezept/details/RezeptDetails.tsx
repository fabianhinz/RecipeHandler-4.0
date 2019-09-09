import React, { FC } from "react";
import { RouteComponentProps } from "react-router";

interface DetailsRouteParams {
  id: string;
}

const RezeptDetails: FC<RouteComponentProps<DetailsRouteParams>> = props => (
  <div>details works {props.match.params.id}</div>
);

export default RezeptDetails;
