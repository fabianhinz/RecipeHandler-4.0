import React, { FC, useState, useEffect, useCallback } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Divider,
  Fade,
  Collapse,
  Box,
  makeStyles,
  createStyles,
  IconButton
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import EyeIcon from "@material-ui/icons/RemoveRedEyeTwoTone";
import { useRouter } from "../../../routes/RouterContext";
import { CategoriesAs, Categories } from "../../category/Categories";
import { RecipeCreateAttachements } from "./RecipeCreateAttachements";
import { useSnackbar } from "notistack";
import { Subtitle } from "../../../util/Subtitle";
import { RecipeResult } from "../result/RecipeResult";
import { Recipe } from "../../../util/Mock";

export interface RecipeAttachement {
  name: string;
  dataUrl: string;
  size: number;
}

const useStyles = makeStyles(theme =>
  createStyles({
    textFieldName: {
      marginBottom: theme.spacing(1)
    }
  })
);

const RecipeCreate: FC = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { history, location } = useRouter();
  const classes = useStyles();

  const [ingredients, setIngredients] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attachements, setAttachements] = useState<RecipeAttachement[]>([]);
  const [name, setName] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const [categories, setSelectedCategories] = useState<
    CategoriesAs<Array<string>>
  >({ type: [], time: [] });

  useEffect(() => {
    try {
      const {
        name,
        categories,
        attachements,
        ingredients,
        description
      } = location.state as Recipe;
      setName(name);
      setSelectedCategories(categories);
      setAttachements(attachements);
      setIngredients(ingredients);
      setDescription(description);
    } catch (e) {
      if (location.pathname.includes("/edit/"))
        enqueueSnackbar(
          <>Rezept nicht gefunden, Bestimmt möchtest du eine neues erstellen</>,
          { variant: "info" }
        );
    }
  }, [enqueueSnackbar, location.pathname, location.state]);

  const handleAttachementsDrop = (newAttachements: RecipeAttachement[]) => {
    setAttachements(previous => [...previous, ...newAttachements]);
  };

  const handleRemoveAttachement = (name: string) => {
    setAttachements(previous =>
      previous.filter(attachement => attachement.name !== name)
    );
  };

  const handleCategoriesChange = (categories: CategoriesAs<Array<string>>) => {
    setSelectedCategories(categories);
  };
  // ? with useCallback  and memo chained together we improve performance
  const handleSaveAttachement = useCallback(
    (name: { old: string; new: string }) => {
      // ! close all remaining snackbars - don't know if this is a good idea
      closeSnackbar();
      if (attachements.filter(a => a.name === name.new).length > 0) {
        enqueueSnackbar(
          <>Änderung wird nicht gespeichert. Name bereits vorhanden</>,
          {
            variant: "warning"
          }
        );
      } else {
        attachements.forEach(attachement => {
          if (attachement.name === name.old) attachement.name = name.new;
        });
        setAttachements(attachements);
        enqueueSnackbar(
          <>
            Name von '{name.old}' auf '{name.new}' geändert
          </>,
          {
            variant: "success"
          }
        );
      }
    },
    [attachements, closeSnackbar, enqueueSnackbar]
  );

  return (
    <Fade in>
      <Box margin={2}>
        <Card>
          <CardHeader
            title={
              <TextField
                className={classes.textFieldName}
                label="Name"
                value={name}
                placeholder="Bitte eintragen"
                onChange={e => setName(e.target.value)}
              />
            }
            subheader="Ein Rezept sollte mindestens ein Bild, eine Zutatenliste und eine Beschreibung behinhalten. Ein Teil der Beschreibung wird in der Rezeptübersicht auf der Startseite angezeigt."
          />
          <CardContent>
            <Subtitle text="Kategorien" />
            <Categories
              fromRecipe={categories}
              onChange={handleCategoriesChange}
            />

            <Box marginTop={2} marginBottom={2}>
              <Divider />
            </Box>

            <Subtitle icon={<CameraIcon />} text="Bilder" />
            <RecipeCreateAttachements
              onAttachements={handleAttachementsDrop}
              onRemoveAttachement={handleRemoveAttachement}
              onSaveAttachement={handleSaveAttachement}
              attachements={attachements}
            />

            <Subtitle icon={<AssignmentIcon />} text="Zutaten" />
            <TextField
              placeholder="Zutatenliste"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              fullWidth
              rows={5}
              multiline
              variant="outlined"
            />

            <Subtitle icon={<BookIcon />} text="Beschreibung" />
            <TextField
              placeholder="Beschreibung"
              value={description}
              rows={5}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              multiline
              variant="outlined"
            />
          </CardContent>

          <CardActions>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Button size="small" onClick={() => history.goBack()}>
                  Abbrechen
                </Button>

                <Button size="small" color="primary">
                  Speichern
                </Button>
              </Grid>
              <Grid item>
                <IconButton onClick={() => setPreview(previous => !previous)}>
                  <EyeIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardActions>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Collapse in={preview} timeout="auto" unmountOnExit mountOnEnter>
            <CardContent>
              <RecipeResult
                name={name}
                created={new Date().toLocaleDateString()}
                categories={categories}
                attachements={attachements}
                ingredients={ingredients}
                description={description}
              />
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </Fade>
  );
};

export default RecipeCreate;
