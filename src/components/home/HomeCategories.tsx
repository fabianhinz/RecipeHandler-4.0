import React, { FC } from "react";
import { Grid, Card, CardHeader, CardContent } from "@material-ui/core";
import { Categories } from "../category/Categories";
// ! ToDo fix layout "jumping"
export const HomeCategories: FC = () => {
  return (
    <Grid item>
      <Card>
        <CardHeader title="Kategorien" />
        <CardContent>
          <Grid direction="column" container spacing={2}>
            <Categories />
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
