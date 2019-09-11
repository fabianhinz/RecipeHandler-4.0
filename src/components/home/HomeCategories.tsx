import AddIcon from "@material-ui/icons/AddTwoTone";
import RemoveIcon from "@material-ui/icons/RemoveTwoTone";
import React, { FC, useState } from "react";
import {
  ButtonBase,
  Chip,
  createStyles,
  Grid,
  makeStyles,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent
} from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    buttonBase: {
      borderRadius: 16
    }
  })
);

export const HomeCategories: FC = props => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const classes = useStyles();

  const handleCategoryClick = (category: string) => () => {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    setSelectedCategories(new Set(selectedCategories));
  };

  return (
    <Grid item>
      <Card>
        <CardHeader title="Kategorien" />
        <CardContent>
          <Grid container spacing={2}>
            {["Salat", "Fleisch", "vegetarisch"].map(category => (
              <Grid item key={category}>
                <ButtonBase
                  className={classes.buttonBase}
                  onClick={handleCategoryClick(category)}
                >
                  <Chip
                    avatar={
                      <Avatar>
                        {selectedCategories.has(category) ? (
                          <RemoveIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Avatar>
                    }
                    color={
                      selectedCategories.has(category) ? "primary" : "default"
                    }
                    label={
                      <Typography variant="subtitle2">{category}</Typography>
                    }
                  />
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
