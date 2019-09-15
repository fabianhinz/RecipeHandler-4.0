import React, { FC, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Divider,
  Typography,
  Fade,
  Collapse,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import { useRouter } from "../../../routes/RouterContext";
import { Categories } from "../../category/Categories";
import { RecipeCreateAttachements } from "./RecipeCreateAttachements";
import { useSnackbar } from "notistack";
import ReactMarkdown from "react-markdown";
import { BORDER_RADIUS } from "../../../Theme";
import { CategoryChipsReadonly } from "../../category/CategoryChips";

export interface RecipeAttachement {
  name: string;
  dataUrl: string;
  size: number;
}

const RecipeCreate: FC = () => {
  const { history } = useRouter();

  const [ingredients, setIngredients] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [attachements, setAttachements] = useState<RecipeAttachement[]>([]);
  const [name, setName] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const [categories, setSelectedCategories] = useState<{
    type: Array<string>;
    time: Array<string>;
  }>({ type: [], time: [] });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleAttachementsDrop = (newAttachements: RecipeAttachement[]) => {
    setAttachements(previous => [...previous, ...newAttachements]);
  };

  const handleRemoveAttachement = (name: string) => {
    setAttachements(previous =>
      previous.filter(attachement => attachement.name !== name)
    );
  };

  const handleCategoriesChange = (categories: {
    type: Array<string>;
    time: Array<string>;
  }) => {
    setSelectedCategories(categories);
  };

  const handleSaveAttachement = (name: { old: string; new: string }) => {
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
  };

  return (
    <Fade in>
      <Card>
        <CardHeader
          title={
            <TextField
              label="Name"
              margin="normal"
              value={name}
              placeholder="Bitte eintragen"
              onChange={e => setName(e.target.value)}
            />
          }
          subheader="Ein Rezept sollte mindestens ein Bild, eine Zutatenliste und eine Beschreibung behinhalten. Ein Teil der Beschreibung wird in der Rezeptübersicht auf der Startseite angezeigt."
        />
        <CardContent>
          <Grid direction="column" container spacing={2}>
            <Grid item>
              <Typography variant="h6">Kategorien</Typography>
            </Grid>
            <Categories onChange={handleCategoriesChange} />

            <Grid item>
              <Divider />
            </Grid>

            <Grid item>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <CameraIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h6">Bilder</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <RecipeCreateAttachements
                onAttachements={handleAttachementsDrop}
                onRemoveAttachement={handleRemoveAttachement}
                onSaveAttachement={handleSaveAttachement}
                attachements={attachements}
              />
            </Grid>

            <Grid item>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <AssignmentIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h6">Zutaten</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                placeholder="Zutatenliste"
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                fullWidth
                rows={5}
                multiline
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <BookIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h6">Beschreibung</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                placeholder="Beschreibung"
                value={description}
                rows={5}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                multiline
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item>
              <Divider />
            </Grid>
          </Grid>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={preview}
                    onChange={() => setPreview(previous => !previous)}
                  />
                }
                labelPlacement="start"
                label="Vorschau"
              />
            </Grid>
          </Grid>
        </CardActions>

        {/* ToDo extract preview*/}
        <Collapse in={preview} timeout="auto" unmountOnExit mountOnEnter>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">{name}</Typography>
              </Grid>

              <Grid item>
                <CategoryChipsReadonly
                  variant="type"
                  color="primary"
                  items={categories.type}
                />
              </Grid>
              <Grid item>
                <CategoryChipsReadonly
                  color="secondary"
                  variant="time"
                  items={categories.time}
                />
              </Grid>

              <Grid item></Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {attachements.map(attachement => (
                    <Grid xs={12} md={6} lg={4} item key={attachement.name}>
                      <img
                        style={{ borderRadius: BORDER_RADIUS }}
                        src={attachement.dataUrl}
                        alt=""
                        width="100%"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <AssignmentIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">Zutaten</Typography>
                  </Grid>
                </Grid>
                <ReactMarkdown source={ingredients} />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <BookIcon />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">Beschreibung</Typography>
                  </Grid>
                </Grid>
                <ReactMarkdown source={description} />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </Fade>
  );
};

export default RecipeCreate;
