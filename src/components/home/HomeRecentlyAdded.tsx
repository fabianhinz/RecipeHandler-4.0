import React, { FC } from "react";
import LinkIcon from "@material-ui/icons/LinkTwoTone";
import {
  Chip,
  Grid,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent
} from "@material-ui/core";
import { PATHS } from "../../routes/Routes";
import { useRouter } from "../../routes/RouterContext";
import { MOCK_RECIPES } from "../../util/Mock";

export const HomeRecentlyAdded: FC = () => {
  const { history } = useRouter();

  return (
    <Grid item>
      <Card>
        <CardHeader title="Zuletzt hinzugefügt" />
        <CardContent>
          <Grid container spacing={2}>
            {MOCK_RECIPES.map(category => (
              <Grid item key={category}>
                <Chip
                  onClick={() => history.push(PATHS.recipeDetails(category))}
                  avatar={
                    <Avatar>
                      <LinkIcon />
                    </Avatar>
                  }
                  label={
                    <Typography variant="subtitle2">{category}</Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
