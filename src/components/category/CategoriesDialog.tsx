import React, { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Box,
  DialogContentText,
  Chip,
  InputBase,
  RadioGroup,
  FormControlLabel,
  Radio,
  makeStyles,
  createStyles
} from "@material-ui/core";
import { Categories, CategoryVariants } from "./Categories";
import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";

interface CategoriesDialogProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles(theme =>
  createStyles({
    radioGroup: {
      justifyContent: "center",
      flexDirection: "row"
    },
    icon: {
      marginRight: theme.spacing(1)
    }
  })
);

export const CategoriesDialog: FC<CategoriesDialogProps> = ({
  open,
  onClose
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [variant, setVariant] = useState<CategoryVariants>();

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Kategorien bearbeiten</DialogTitle>
      <DialogContent>
        <Box marginBottom={2}>
          <DialogContentText>
            Vorhandene Kategorien bearbeiten
          </DialogContentText>
          <Categories edit />
        </Box>

        <DialogContentText>Neue Kategorien hinzufügen</DialogContentText>

        <RadioGroup className={classes.radioGroup}>
          <FormControlLabel
            value="male"
            control={<Radio color="primary" />}
            labelPlacement="start"
            label={
              <Box display="flex" alignItems="center">
                <BookIcon className={classes.icon} />
                Art
              </Box>
            }
          />

          <FormControlLabel
            value="female"
            control={<Radio color="primary" />}
            labelPlacement="start"
            label={
              <Box display="flex" alignItems="center">
                <TimerIcon className={classes.icon} />
                Zeit
              </Box>
            }
          />
        </RadioGroup>

        <Chip
          onDelete={() => alert("TODO")}
          deleteIcon={<AddIcon />}
          label={<InputBase placeholder="Namen eintragen" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onClose} color="primary" autoFocus>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};
