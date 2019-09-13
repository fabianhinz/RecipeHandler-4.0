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
  Fade
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import { useRouter } from "../../../routes/RouterContext";
import { Categories } from "../../category/Categories";
import { BadgeRating } from "../../../util/BadgeRating";
import { RecipeAttachementsDropzone } from "./RecipeAttachementsDropzone";

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
  const [test, setTest] = useState<string>();
  const [attachements, setAttachements] = useState<RecipeAttachement[]>([]);

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

  return (
    <Fade in>
      <Card>
        <CardHeader
          title="Rezept erstellen"
          subheader="Ein Rezept sollte mindestens ein Bild, eine Zutatenliste und eine Beschreibung behinhalten. Ein optionale Kurzbeschreibung wird in der Rezeptübersicht auf der Startseite angezeigt."
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
              <Typography variant="h6">Details</Typography>

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
                <RecipeAttachementsDropzone
                  onAttachements={handleAttachementsDrop}
                  onRemoveAttachement={handleRemoveAttachement}
                  attachements={attachements}
                />
              )}
              {selectedTab.key === INGREDIENTS_KEY && (
                <TextField
                  placeholder="Zutatenliste"
                  value={test}
                  onChange={e => setTest(e.target.value)}
                  fullWidth
                  multiline
                  margin="normal"
                  variant="outlined"
                />
              )}
              {selectedTab.key === DESCRIPTION_KEY && (
                <TextField
                  placeholder="Beschreibung"
                  fullWidth
                  multiline
                  margin="normal"
                  variant="outlined"
                />
              )}
              {/* <ReactMarkdown source={test} /> */}
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Button size="small" onClick={() => history.goBack()}>
                Abbrechen
              </Button>
              <Button size="small" color="secondary">
                Vorschau
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
      </Card>
    </Fade>
  );
};

export default RecipeCreate;
