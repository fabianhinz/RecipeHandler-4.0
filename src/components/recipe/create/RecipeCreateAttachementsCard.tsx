import React, { FC, useState } from "react";
import {
  makeStyles,
  createStyles,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardHeader,
  TextField
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import { RecipeAttachement } from "./RecipeCreate";

const useStyles = makeStyles(theme => {
  return createStyles({
    // source: https://material-ui.com/components/cards/#cards
    cardMedia: {
      height: 0,
      paddingTop: "56.25%" // 16:9,
    }
  });
});
// ! on readonly those handler don't extist
export interface AttachementsCardChangeHandler {
  onRemoveAttachement?: (attachementName: string) => void;
  onSaveAttachement?: (name: { old: string; new: string }) => void;
}

interface RecipeCreateAttachementsCardProps
  extends AttachementsCardChangeHandler {
  attachement: RecipeAttachement;
  readonly?: boolean;
}

export const RecipeCreateAttachementsCard: FC<
  RecipeCreateAttachementsCardProps
> = ({ attachement, onRemoveAttachement, onSaveAttachement, readonly }) => {
  const [name, setName] = useState<string>(attachement.name);
  const classes = useStyles();

  return (
    <Grid item key={attachement.name}>
      <Card raised onClick={e => e.stopPropagation()}>
        <CardMedia className={classes.cardMedia} image={attachement.dataUrl} />

        <CardHeader
          title={
            <TextField
              disabled={readonly}
              margin="dense"
              label="Name"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          }
          subheader={`${(attachement.size / 1000000).toFixed(1)} MB`}
          action={
            <>
              {!readonly && (
                <>
                  <IconButton
                    disabled={attachement.name === name}
                    onClick={() =>
                      onSaveAttachement!({ old: attachement.name, new: name })
                    }
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onRemoveAttachement!(attachement.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </>
          }
        />
      </Card>
    </Grid>
  );
};
