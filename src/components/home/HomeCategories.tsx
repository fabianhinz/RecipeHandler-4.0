import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
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
            <Grid item container spacing={2}>
              {["Salat", "Fleisch", "vegetarisch"].map(category => (
                <Grid item key={category}>
                  <ButtonBase
                    className={classes.buttonBase}
                    onClick={handleCategoryClick(category)}
                  >
                    <Chip
                      avatar={
                        <Avatar>
                          <BookIcon />
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
            <Grid item container spacing={2}>
              {[
                "~20 Minuten",
                "~30 Minuten",
                "~40 Minuten",
                "> 50 Minuten"
              ].map(category => (
                <Grid item key={category}>
                  <ButtonBase
                    className={classes.buttonBase}
                    onClick={handleCategoryClick(category)}
                  >
                    <Chip
                      avatar={
                        <Avatar>
                          <TimerIcon />
                        </Avatar>
                      }
                      color={
                        selectedCategories.has(category)
                          ? "secondary"
                          : "default"
                      }
                      label={
                        <Typography variant="subtitle2">{category}</Typography>
                      }
                    />
                  </ButtonBase>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
