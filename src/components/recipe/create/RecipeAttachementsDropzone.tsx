import React, { useCallback, useEffect, FC } from "react";
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
import { RecipeAttachement } from "./RecipeCreate";

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

const useStyles = makeStyles(theme => {
  return createStyles({
    rootProps: {
      outline: "none"
    },
    dropActive: {
      background: theme.palette.primary.light
    },
    // source: https://material-ui.com/components/cards/#cards
    cardMedia: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    filesGrid: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      minHeight: 56
    },
    addIcon: {
      marginRight: theme.spacing(1)
    }
  });
});

interface RecipeAttachementsDropzoneProps {
  onAttachements: (newFiles: RecipeAttachement[]) => void;
  attachements: RecipeAttachement[];
}

export const RecipeAttachementsDropzone: FC<
  RecipeAttachementsDropzoneProps
> = props => {
  const classes = useStyles();
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

      const loadingKey = enqueueSnackbar(<>Dateien werden geladen</>, {
        variant: "info"
      });

      const newFiles: RecipeAttachement[] = [];
      for (const file of acceptedFiles) {
        const dataUrl = (await readDocumentAsync(file, "dataUrl")) as string;
        newFiles.push({ name: file.name, dataUrl, size: file.size });
      }
      props.onAttachements(newFiles);
      closeSnackbar(loadingKey as string);
    },
    [closeSnackbar, enqueueSnackbar, props]
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
    <Grid className={classes.filesGrid} container spacing={2} justify="center">
      <Grid item xs={12} container justify="center">
        <div {...getRootProps()} className={classes.rootProps}>
          <input {...getInputProps()} />
          <Fab size="medium" color="primary" variant="extended">
            <AddIcon className={classes.addIcon} />
            Bilder hinzufügen
          </Fab>
        </div>
      </Grid>
      {props.attachements.map(attachement => (
        <Grid item key={attachement.name}>
          <Card raised onClick={e => e.stopPropagation()}>
            <CardHeader
              title={attachement.name}
              subheader={attachement.size}
              action={
                <IconButton>
                  <CancelIcon />
                </IconButton>
              }
            />
            <CardMedia
              className={classes.cardMedia}
              image={attachement.dataUrl}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
