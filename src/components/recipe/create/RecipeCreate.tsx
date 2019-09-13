import React, { FC, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Tabs,
  Tab,
  Grid,
  Divider,
  Typography,
  useMediaQuery,
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
import { BadgeRating } from "../../../util/BadgeRating";
import { RecipeCreateAttachements } from "./RecipeCreateAttachements";
import { useSnackbar } from "notistack";
import ReactMarkdown from "react-markdown";
import { RecipeCreateAttachementsCard } from "./RecipeCreateAttachementsCard";

export interface RecipeAttachement {
  name: string;
  dataUrl: string;
  size: number;
}

interface Tab {
  icon: JSX.Element;
  key: number;
  label: "Bilder" | "Zutatenliste" | "Beschreibungen";
}

const PICTURE_KEY = 0;
const INGREDIENTS_KEY = 1;
const DESCRIPTION_KEY = 2;

const editorTabs: Tab[] = [
  { key: PICTURE_KEY, label: "Bilder", icon: <CameraIcon /> },
  { key: INGREDIENTS_KEY, label: "Zutatenliste", icon: <AssignmentIcon /> },
  { key: DESCRIPTION_KEY, label: "Beschreibungen", icon: <BookIcon /> }
];

const RecipeCreate: FC = () => {
  const { history } = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>(editorTabs[0]);
  const [ingredients, setIngredients] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [attachements, setAttachements] = useState<RecipeAttachement[]>([]);
  const [name, setName] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // matches Tablet width
  const matches = useMediaQuery("(min-width:768px)");

  const handleTabChange = (event: React.ChangeEvent<{}>, newKey: number) => {
    // ! if we use editorTabs as intended find always returns a tab object
    setSelectedTab(editorTabs.find(tab => tab.key === newKey)!);
  };

  const handleAttachementsDrop = (newAttachements: RecipeAttachement[]) => {
    setAttachements(previous => [...previous, ...newAttachements]);
  };

  const handleRemoveAttachement = (name: string) => {
    setAttachements(previous =>
      previous.filter(attachement => attachement.name !== name)
    );
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
            <Categories />

            <Grid item>
              <Divider />
            </Grid>

            <Grid item>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="h6">Details</Typography>
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
              {/* ToDo extract tabs*/}
              <Tabs
                indicatorColor="secondary"
                value={selectedTab.key}
                onChange={handleTabChange}
              >
                {editorTabs.map(({ label, ...editorTab }) => (
                  <Tab wrapped {...editorTab} label={matches ? label : ""} />
                ))}
              </Tabs>

              {selectedTab.key === PICTURE_KEY && (
                <RecipeCreateAttachements
                  onAttachements={handleAttachementsDrop}
                  onRemoveAttachement={handleRemoveAttachement}
                  onSaveAttachement={handleSaveAttachement}
                  attachements={attachements}
                />
              )}
              {selectedTab.key === INGREDIENTS_KEY && (
                <TextField
                  placeholder="Zutatenliste"
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  fullWidth
                  multiline
                  margin="normal"
                  variant="outlined"
                />
              )}
              {selectedTab.key === DESCRIPTION_KEY && (
                <TextField
                  placeholder="Beschreibung"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  margin="normal"
                  variant="outlined"
                />
              )}
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
              <BadgeRating />
            </Grid>
          </Grid>
        </CardActions>

        {/* ToDo extract preview*/}
        <Collapse in={preview} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item>
                <Typography variant="h6">{name}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {attachements.map(attachement => (
                    <RecipeCreateAttachementsCard
                      key={attachement.name}
                      readonly
                      attachement={attachement}
                    />
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <ReactMarkdown source={ingredients} />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
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
