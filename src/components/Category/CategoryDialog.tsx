import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import React, { FC } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputBase,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import { SlideUp } from "../Shared/Transitions";
import { CategoryWrapper } from "./CategoryWrapper";

interface CategoryDialogProps {
    open: boolean;
    onClose: () => void;
}

export const CategoryDialog: FC<CategoryDialogProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    // ! TODO when we add new categorys or change names we must go through all documents (batch?)
    // 1. new categories: all documents must have the same fields (firestore will crash otherwise)
    // 2. name change: all documents who had the old category name should be updated to match the new one
    const handleNameChange = (key: string, oldValue: string, newValue: string) =>
        console.log(key, oldValue, newValue);

    return (
        <Dialog
            keepMounted
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
                    <CategoryWrapper onNameChange={handleNameChange} />
                </Box>

                <DialogContentText>Neue Kategorie hinzufügen</DialogContentText>

                <Chip
                    onDelete={() => alert("TODO")}
                    deleteIcon={<AddIcon />}
                    label={<InputBase placeholder="Namen eintragen" />}
                />
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
