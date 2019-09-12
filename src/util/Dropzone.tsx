import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  makeStyles,
  createStyles,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardHeader,
  Fab
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/CancelTwoTone";
import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import { useSnackbar } from "notistack";

const readDocumentAsync = (
  document: any,
  readAs: "arrayBuffer" | "dataUrl"
) => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    if (readAs === "arrayBuffer") reader.readAsArrayBuffer(document);
    if (readAs === "dataUrl") reader.readAsDataURL(document);
    else console.error("unkown readAs param");
  });
};

interface RecipeAttachement {
  name: string;
  dataUrl: string;
  size: number;
}

const useStyles = makeStyles(theme =>
  createStyles({
    rootProps: {
      outline: "none",
      borderRadius: 10,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      minHeight: 100
    },
    // source: https://material-ui.com/components/cards/#cards
    cardMedia: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    filesGrid: {
      padding: theme.spacing(2)
    },
    addIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

export const Dropzone = () => {
  const classes = useStyles();
  const [files, setFiles] = useState<RecipeAttachement[]>([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: File[]) => {
      if (rejectedFiles.length > 0)
        enqueueSnackbar(<>Lediglich JPG, PNG sind möglich</>, {
          variant: "error"
        });

      if (acceptedFiles.length >= 10)
        return enqueueSnackbar(
          <>Mehr als 10 Bilder pro Rezept sind nicht möglich</>,
          { variant: "warning" }
        );

      const newFiles: RecipeAttachement[] = [];
      for (const file of acceptedFiles) {
        const dataUrl = (await readDocumentAsync(file, "dataUrl")) as string;
        newFiles.push({ name: file.name, dataUrl, size: file.size });
      }
      setFiles(previous => [...previous, ...newFiles]);
    },
    [enqueueSnackbar]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png"
  });

  useEffect(() => {
    if (isDragActive)
      enqueueSnackbar(<>Bilder ablegen um sie mit dem Rezept zu verknüpfen</>, {
        variant: "info"
      });
    else closeSnackbar();
  }, [closeSnackbar, enqueueSnackbar, isDragActive]);

  return (
    <div {...getRootProps()} className={classes.rootProps}>
      <input {...getInputProps()} />

      <Grid
        className={classes.filesGrid}
        container
        spacing={2}
        justify="center"
      >
        {files.length === 0 && (
          <Grid item>
            <Fab size="large" color="primary" variant="extended">
              <AddIcon className={classes.addIcon} />
              Bilder hinzufügen
            </Fab>
          </Grid>
        )}
        {files.map(file => (
          <Grid item key={file.name}>
            <Card raised onClick={e => e.stopPropagation()}>
              <CardHeader
                title={file.name}
                subheader={file.size}
                action={
                  <IconButton>
                    <CancelIcon />
                  </IconButton>
                }
              />
              <CardMedia className={classes.cardMedia} image={file.dataUrl} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
