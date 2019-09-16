import React, { FC } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  IconButton
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/EditTwoTone";
import { Categories } from "../category/Categories";

export const HomeCategories: FC = () => {
  return (
    <Box margin={2}>
      <Card>
        <CardHeader
          title="Kategorien"
          action={
            <IconButton>
              <EditIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Categories />
        </CardContent>
      </Card>
    </Box>
  );
};
