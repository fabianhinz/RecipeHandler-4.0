import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import BookIcon from "@material-ui/icons/BookTwoTone";
import React, { FC, useState } from "react";
import TimerIcon from "@material-ui/icons/AvTimerTwoTone";
import {
    Box,
    Button,
    Chip,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    InputBase,
    makeStyles,
    Radio,
    RadioGroup,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import { chipPropsFrom } from "./Category";
import { SlideUp } from "../Shared/Transitions";
import { CategoryWrapper } from "./CategoryWrapper";
import { CategoryVariants } from "../../model/model";
import { CategoryBase } from "./CategoryBase";

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
        },
        inputBase: {
            color: "#000",
            width: "100%"
        }
    })
);

interface CategoryDialogProps {
    open: boolean;
    onClose: () => void;
}

export const CategoryDialog: FC<CategoryDialogProps> = ({ open, onClose }) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [variant, setVariant] = useState<CategoryVariants>("type");
    return (
        <Dialog
            hideBackdrop={fullScreen}
            TransitionComponent={SlideUp}
            fullWidth
            maxWidth="md"
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Kategorien bearbeiten</DialogTitle>
            <DialogContent>
                <Box marginBottom={2}>
                    <DialogContentText>Vorhandene Kategorien bearbeiten</DialogContentText>
                    <CategoryWrapper edit />
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

                <CategoryBase className={classes.chip}>
                    <Chip
                        {...chipPropsFrom(variant)}
                        onDelete={() => alert("TODO")}
                        deleteIcon={<AddIcon />}
                        classes={{ label: classes.label }}
                        label={
                            <InputBase
                                className={classes.inputBase}
                                placeholder="Namen eintragen"
                            />
                        }
                    />
                </CategoryBase>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Abbrechen</Button>
                <Button onClick={onClose} color="primary">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
};
