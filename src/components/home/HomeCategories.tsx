import React, { FC } from "react";
import { Card, CardHeader, CardContent, Box } from "@material-ui/core";
import { Categories } from "../category/Categories";

export const HomeCategories: FC = () => {
  return (
    <Box margin={2}>
      <Card>
        <CardHeader title="Kategorien" />
        <CardContent>
          <Categories />
        </CardContent>
      </Card>
    </Box>
  );
};
