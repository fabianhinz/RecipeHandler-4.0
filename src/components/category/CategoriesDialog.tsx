import React, { FC, useState, useRef } from "react";
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
  createStyles,
  Slide
} from "@material-ui/core";
import { Categories, CategoryVariants } from "./Categories";
import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { chipPropsFrom, CategoryButtonBase } from "./CategoryChips";

interface CategoriesDialogProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles(theme =>
  createStyles({
    radioGroup: {
      justifyContent: "center",
      flexDirection: "row",
      flexWrap: "nowrap",
      overflowX: "auto"
    },
    icon: {
      marginRight: theme.spacing(1)
    },
    chip: {
      borderRadius: 16,
      marginTop: theme.spacing(1),
      width: "100%",
      "& > *": {
        width: "100%"
      }
    },
    label: {
      width: "100%"
    }
  })
);

const SlideLeft = React.forwardRef<unknown, TransitionProps>((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

export const CategoriesDialog: FC<CategoriesDialogProps> = ({
  open,
  onClose
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [variant, setVariant] = useState<CategoryVariants>("type");
  return (
    <Dialog
      hideBackdrop={fullScreen}
      TransitionComponent={SlideLeft}
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

        <DialogContentText>Neue Kategorie hinzufügen</DialogContentText>

        <RadioGroup
          className={classes.radioGroup}
          value={variant}
          onChange={(_e, value) => setVariant(value as CategoryVariants)}
        >
          <FormControlLabel
            value="type"
            control={<Radio color="default" />}
            label={
              <Box display="flex" alignItems="center">
                <BookIcon className={classes.icon} />
                Art
              </Box>
            }
          />

          <FormControlLabel
            value="time"
            control={<Radio color="default" />}
            label={
              <Box display="flex" alignItems="center">
                <TimerIcon className={classes.icon} />
                Zeit
              </Box>
            }
          />
        </RadioGroup>

        <CategoryButtonBase className={classes.chip}>
          <Chip
            {...chipPropsFrom(variant)}
            onDelete={() => alert("TODO")}
            deleteIcon={<AddIcon />}
            classes={{ label: classes.label }}
            label={
              <InputBase
                className={classes.label}
                placeholder="Namen eintragen"
              />
            }
          />
        </CategoryButtonBase>
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
