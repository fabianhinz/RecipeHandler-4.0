import {
    Box,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import React, { FC, useEffect, useState } from 'react'

import { RecipeDocument } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { CategoryResult } from '../../Category/CategoryResult'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import Progress from '../../Shared/Progress'
import { SlideUp } from '../../Shared/Transitions'

interface RecipeCreateRelatedDialogProps {
    defaultValues: Array<string>
    currentRecipeName: string
    open: boolean
    onClose: (relatedRecipes: Array<string>) => void
}

export const RecipeCreateRelatedDialog: FC<RecipeCreateRelatedDialogProps> = ({
    onClose,
    open,
    currentRecipeName,
    defaultValues,
}) => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const [selected, setSelected] = useState<Set<string>>(new Set(defaultValues))

    const { isDialogFullscreen } = useBreakpointsContext()

    useEffect(() => {
        if (!open) return

        FirebaseService.firestore
            .collection('recipes')
            .orderBy('createdDate', 'desc')
            .get()
            .then(querySnapshot =>
                setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
            )
    }, [open])

    const handleSelectedChange = (recipeName: string) => {
        if (selected.has(recipeName)) selected.delete(recipeName)
        else selected.add(recipeName)
        setSelected(new Set(selected))
    }

    const handleClose = () => onClose([...selected.values()])

    const handleCancelBtnClick = () => {
        setSelected(new Set(defaultValues))
        onClose(defaultValues)
    }

    return (
        <Dialog
            keepMounted
            fullScreen={isDialogFullscreen}
            TransitionComponent={SlideUp}
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth>
            <DialogTitle>Passende Rezepte auswählen</DialogTitle>
            <DialogContent>
                {recipes.length === 0 && <Progress variant="cover" />}
                <List>
                    {recipes
                        .filter(recipe => recipe.name !== currentRecipeName)
                        .map(recipe => (
                            <ListItem
                                onClick={() => handleSelectedChange(recipe.name)}
                                key={recipe.name}
                                button>
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
                                    secondaryTypographyProps={{ component: 'div' }}
                                    secondary={
                                        <>
                                            <Typography gutterBottom color="textSecondary">
                                                {FirebaseService.createDateFromTimestamp(
                                                    recipe.createdDate
                                                ).toLocaleString()}
                                            </Typography>
                                            <CategoryResult categories={recipe.categories} />
                                        </>
                                    }
                                />
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
                        disabled={selected.size === 0}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </DialogActions>
        </Dialog>
    )
}
