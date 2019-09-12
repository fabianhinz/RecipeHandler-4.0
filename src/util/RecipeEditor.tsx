import React, { FC, useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Tabs,
  Tab
} from "@material-ui/core";
import { useRouter } from "../routes/RouterContext";
import ReactMarkdown from "react-markdown";
import CameraIcon from "@material-ui/icons/CameraTwoTone";
import AssignmentIcon from "@material-ui/icons/AssignmentTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";

// const useStyles = makeStyles(theme => {
//   const { palette, spacing, shape } = theme;

//   return createStyles({
//     tabs: {}
//   });
// });
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

export const RecipeEditor: FC = () => {
  const { history } = useRouter();
  const [tab, setTab] = useState<Tab>(editorTabs[0]);
  const [test, setTest] = useState<string>();

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
        <Tabs centered value={tab.key} onChange={handleTabChange}>
          {editorTabs.map(editorTab => (
            <Tab {...editorTab} />
          ))}
        </Tabs>
        {tab.key === PICTURE_KEY && (
          <TextField
            placeholder="ToDo Bild handler"
            fullWidth
            multiline
            rows="10"
            margin="normal"
            variant="outlined"
          />
        )}
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
        <ReactMarkdown source={test} />
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => history.goBack()}>
          Abbrechen
        </Button>
        <Button size="small" color="secondary">
          Vorschau
        </Button>
        <Button size="small" color="primary">
          Speichern
        </Button>
      </CardActions>
    </Card>
  );
};
