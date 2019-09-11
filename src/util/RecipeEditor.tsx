import React, { FC, useEffect, useRef } from "react";
import { Editor, EditorState, RichUtils, DraftHandleValue } from "draft-js";
import {
  makeStyles,
  createStyles,
  ButtonGroup,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography
} from "@material-ui/core";
import { useRouter } from "../routes/RouterContext";

type Style = "BOLD" | "ITALIC" | "UNDERLINE" | "CODE";

interface InlineStyle {
  label: JSX.Element;
  style: Style;
}

const inlineStyles: InlineStyle[] = [
  { label: <b>F</b>, style: "BOLD" },
  { label: <i>K</i>, style: "ITALIC" },
  { label: <u>U</u>, style: "UNDERLINE" }
  // { label: <code>m</code>, style: "CODE" }
];

const useStyles = makeStyles(theme => {
  const { palette, spacing, shape } = theme;

  return createStyles({
    editorContainer: {
      minHeight: 200,
      padding: spacing(1),
      borderRadius: shape.borderRadius,
      border: `1px solid ${palette.divider}`,
      cursor: "text"
    },
    btnGroup: {
      marginBottom: spacing(1)
    }
  });
});

export const RecipeEditor: FC = () => {
  const { history } = useRouter();
  const classes = useStyles();
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const editorRef = useRef<Editor>(null);
  const currentStyles = editorState.getCurrentInlineStyle();

  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => editorRef.current!.focus();

  const handleKeyCommand = (
    command: any,
    editorState: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleInlinyStyleChange = (style: string) => () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <Card>
      <CardHeader
        title="Rezept erstellen"
        subheader="Ein Rezept sollte mindestens ein Bild, eine Zutatenliste und eine Beschreibung behinhalten"
      />
      <CardContent>
        <Grid
          className={classes.btnGroup}
          direction="row"
          container
          spacing={1}
        >
          <Grid item>
            <Grid container direction="column">
              <Typography gutterBottom variant="caption">
                Schriftart
              </Typography>
              <ButtonGroup variant="contained" size="small">
                {inlineStyles.map(({ label, style }) => (
                  <Button
                    key={style}
                    color={currentStyles.has(style) ? "primary" : "default"}
                    onClick={handleInlinyStyleChange(style)}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Typography gutterBottom variant="caption">
                Formatvorlagen
              </Typography>
              <ButtonGroup variant="contained" size="small">
                <Button onClick={handleInlinyStyleChange("header-one")}>
                  h1
                </Button>
                <Button>h2</Button>
                <Button>h3</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.editorContainer} onClick={focusEditor}>
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => history.goBack()}>
          Abbrechen
        </Button>
        <Button size="small" color="primary">
          Speichern
        </Button>
      </CardActions>
    </Card>
  );
};
