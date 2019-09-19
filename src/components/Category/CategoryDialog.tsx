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
import { SlideUp } from "../Shared/Transitions";
import { CategoryWrapper, CategoryBase } from "./CategoryWrapper";
import { RecipeCategories } from "../../model/model";

interface CategoryDialogProps {
    open: boolean;
    onClose: () => void;
}

type Categories = Array<{ identifier: string; displayName: string }>;

export const CategoryDialog: FC<CategoryDialogProps> = ({ open, onClose }) => {
    const [categories, setCategories] = useState<RecipeCategories>();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleNameChange = (key: string, value: string) => console.log(key, value);

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
                    <CategoryWrapper
                        categories={{ a: true, b: true }}
                        variant="changeableName"
                        onNameChange={handleNameChange}
                    />
                </Box>

                <DialogContentText>Neue Kategorie hinzufügen</DialogContentText>

                <CategoryBase>
                    <Chip
                        onDelete={() => alert("TODO")}
                        deleteIcon={<AddIcon />}
                        label={<InputBase placeholder="Namen eintragen" />}
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
