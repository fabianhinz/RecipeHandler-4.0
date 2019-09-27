import React, { FC, useState, useEffect } from "react";
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemIcon,
    Checkbox,
    ListItemText,
    ListItemSecondaryAction,
    Tooltip,
    DialogActions,
    Box,
    IconButton,
    Hidden,
    useMediaQuery
} from "@material-ui/core";
import { SlideUp } from "../../Shared/Transitions";
import { FirebaseService } from "../../../firebase";
import { RecipeDocument } from "../../../model/model";
import { avatarFromCategory } from "../../Category/CategoryWrapper";
import { Loading } from "../../Shared/Loading";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import CloseIcon from "@material-ui/icons/CloseTwoTone";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

interface RecipeCreateRelatedDialogProps {
    defaultValues: Array<string>;
    currentRecipeName: string;
    open: boolean;
    onClose: (relatedRecipes: Array<string>) => void;
}

export const RecipeCreateRelatedDialog: FC<RecipeCreateRelatedDialogProps> = ({
    onClose,
    open,
    currentRecipeName,
    defaultValues
}) => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set(defaultValues));

    const fullscreen = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (!open) return;

        FirebaseService.firestore
            .collection("recipes")
            .orderBy("createdDate", "desc")
            .get()
            .then(querySnapshot =>
                setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
            );
    }, [open]);

    const handleSelectedChange = (recipeName: string) => {
        if (selected.has(recipeName)) selected.delete(recipeName);
        else selected.add(recipeName);
        setSelected(new Set(selected));
    };

    const handleClose = () => onClose([...selected.values()]);

    const handleCancelBtnClick = () => {
        setSelected(new Set(defaultValues));
        onClose(defaultValues);
    };

    return (
        <Dialog
            fullScreen={fullscreen}
            TransitionComponent={SlideUp}
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Passende Rezepte auswählen</DialogTitle>
            <DialogContent>
                {recipes.length === 0 && <Loading />}
                <List>
                    {recipes
                        .filter(recipe => recipe.name !== currentRecipeName)
                        .map(recipe => (
                            <ListItem
                                onClick={() => handleSelectedChange(recipe.name)}
                                key={recipe.name}
                                button
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        color="primary"
                                        checked={selected.has(recipe.name)}
                                        edge="start"
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={recipe.name}
                                    secondary={FirebaseService.createDateFromTimestamp(
                                        recipe.createdDate
                                    ).toLocaleString()}
                                />
                                <Hidden xsDown>
                                    <ListItemSecondaryAction onClick={e => e.stopPropagation()}>
                                        <Grid container spacing={1}>
                                            {Object.keys(recipe.categories).map(category => (
                                                <Grid item key={category}>
                                                    <Tooltip title={recipe.categories[category]}>
                                                        {avatarFromCategory(
                                                            recipe.categories[category]
                                                        )}
                                                    </Tooltip>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </ListItemSecondaryAction>
                                </Hidden>
                            </ListItem>
                        ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Box flexGrow={1} display="flex" justifyContent="space-evenly" alignItems="center">
                    <IconButton onClick={handleCancelBtnClick}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton onClick={handleClose}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setSelected(new Set([]))}
                        disabled={selected.size === 0}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
