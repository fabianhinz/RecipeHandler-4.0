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
    Tooltip
} from "@material-ui/core";
import { SlideUp } from "../../Shared/Transitions";
import { FirebaseService } from "../../../firebase";
import { RecipeDocument } from "../../../model/model";
import { avatarFromCategory } from "../../Category/CategoryWrapper";
import { Loading } from "../../Shared/Loading";

interface RecipeCreateRelatedDialogProps {
    currentRecipeName: string;
    open: boolean;
    onClose: (relatedRecipes: Array<string>) => void;
}

export const RecipeCreateRelatedDialog: FC<RecipeCreateRelatedDialogProps> = ({
    onClose,
    open,
    currentRecipeName
}) => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());

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

    return (
        <Dialog
            TransitionComponent={SlideUp}
            open={open}
            onClose={() => onClose([...selected.values()])}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Passende Rezepte auswählen</DialogTitle>
            <DialogContent>
                {recipes.length === 0 && <Loading />}
                <List>
                    {recipes.map(recipe => (
                        <ListItem
                            disabled={recipe.name === currentRecipeName}
                            onClick={() => handleSelectedChange(recipe.name)}
                            key={recipe.name}
                            button
                        >
                            <ListItemIcon>
                                <Checkbox
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
                            <ListItemSecondaryAction onClick={e => e.stopPropagation()}>
                                <Grid container spacing={1}>
                                    {Object.keys(recipe.categories).map(category => (
                                        <Grid item key={category}>
                                            <Tooltip title={recipe.categories[category]}>
                                                {avatarFromCategory(recipe.categories[category])}
                                            </Tooltip>
                                        </Grid>
                                    ))}
                                </Grid>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};
