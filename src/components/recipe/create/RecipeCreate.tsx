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
  useMediaQuery
} from "@material-ui/core";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import { useRouter } from "../../../routes/RouterContext";
import { Categories } from "../../category/Categories";
import { BadgeRating } from "../../../util/BadgeRating";
import { Dropzone } from "../../../util/Dropzone";

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
  const [tab, setTab] = useState<Tab>(editorTabs[0]);
  const [test, setTest] = useState<string>();

  // matches Tablet width
  const matches = useMediaQuery("(min-width:768px)");

  const handleTabChange = (event: React.ChangeEvent<{}>, newKey: number) => {
    // ! if we use editorTabs as intended find always returns a tab object
    setTab(editorTabs.find(tab => tab.key === newKey)!);
  };

  return (
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
              value={tab.key}
              onChange={handleTabChange}
            >
              {editorTabs.map(({ label, ...editorTab }) => (
                <Tab wrapped {...editorTab} label={matches ? label : ""} />
              ))}
            </Tabs>
            {tab.key === PICTURE_KEY && <Dropzone />}
            {tab.key === INGREDIENTS_KEY && (
              <TextField
                placeholder="Zutatenliste"
                value={test}
                onChange={e => setTest(e.target.value)}
                fullWidth
                multiline
                rows="10"
                margin="normal"
                variant="outlined"
              />
            )}
            {tab.key === DESCRIPTION_KEY && (
              <TextField
                placeholder="Beschreibung"
                fullWidth
                multiline
                rows="10"
                margin="normal"
                variant="outlined"
              />
            )}
            {/* <ReactMarkdown source={test} /> */}
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Grid item container justify="space-between" alignItems="center">
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
  );
};

export default RecipeCreate;
