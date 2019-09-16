import React, { FC } from "react";
import { Grid, Typography, makeStyles, createStyles } from "@material-ui/core";
import { CategoryChipsReadonly } from "../../category/CategoryChips";
import { BORDER_RADIUS } from "../../../Theme";
import { Subtitle } from "../../../util/Subtitle";
import ReactMarkdown from "react-markdown";
import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import { CategoriesAs } from "../../category/Categories";
import { RecipeAttachement } from "../create/RecipeCreate";

interface RecipeResultProps {
  name: string;
  created: string;
  categories: CategoriesAs<Array<string>>;
  attachements: RecipeAttachement[];
  ingredients: string;
  description: string;
}

const useStyles = makeStyles(theme =>
  createStyles({
    img: {
      borderRadius: BORDER_RADIUS
    }
  })
);

export const RecipeResult: FC<RecipeResultProps> = ({
  name,
  created,
  categories,
  attachements,
  ingredients,
  description
}) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">{name}</Typography>
      </Grid>

      <Grid item>
        <CategoryChipsReadonly variant="type" items={categories.type} />
      </Grid>
      <Grid item>
        <CategoryChipsReadonly variant="time" items={categories.time} />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          {attachements.map(attachement => (
            <Grid xs={12} md={6} lg={4} item key={attachement.name}>
              <img
                className={classes.img}
                src={attachement.dataUrl}
                alt=""
                width="100%"
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
        <ReactMarkdown source={ingredients} />
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <Subtitle icon={<BookIcon />} text="Beschreibung" />
        <ReactMarkdown source={description} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="caption">Erstellt am: {created}</Typography>
      </Grid>
    </Grid>
  );
};
