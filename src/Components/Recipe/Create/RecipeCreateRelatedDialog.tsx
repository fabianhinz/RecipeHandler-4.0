import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import React, { FC, useEffect, useState } from 'react'

import useDebounce from '../../../hooks/useDebounce'
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
    onSave: (relatedRecipes: Array<string>) => void
    onClose: () => void
}

export const RecipeCreateRelatedDialog: FC<RecipeCreateRelatedDialogProps> = ({
    onClose,
    onSave,
    open,
    currentRecipeName,
    defaultValues,
}) => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const [selected, setSelected] = useState<Set<string>>(new Set(defaultValues))
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false)

    const debouncedSearchValue = useDebounce(searchValue, 500)
    const { isDialogFullscreen } = useBreakpointsContext()

    useEffect(() => {
        if (!open) return

        let mounted = true
        setLoading(true)

        FirebaseService.firestore
            .collection('recipes')
            .where('name', '>=', debouncedSearchValue)
            .orderBy('name', 'asc')
            .limit(10)
            .get()
            .then(querySnapshot => {
                if (mounted) {
                    setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                    setLoading(false)
                }
            })

        return () => {
            mounted = false
        }
    }, [open, debouncedSearchValue])

    const handleSelectedChange = (recipeName: string) => {
        if (selected.has(recipeName)) selected.delete(recipeName)
        else selected.add(recipeName)
        setSelected(new Set(selected))
    }

    const handleCancelBtnClick = () => {
        setSelected(new Set(defaultValues))
        onClose()
    }

    return (
        <Dialog
            keepMounted
            fullScreen={isDialogFullscreen}
            TransitionComponent={SlideUp}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth>
            <DialogTitle>Passende Rezepte auswählen</DialogTitle>
            <DialogContent>
                {loading && <Progress variant="cover" />}
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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography color="textSecondary">
                            Die Auswahl ist auf zehn Rezepte limitiert. Durch optionale Eingabe im
                            Textfeld wird die Auswahl auf passende Rezeptnamen eingeschränkt.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            label="Nach Rezept filtern"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify="space-evenly">
                            <IconButton onClick={handleCancelBtnClick}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton onClick={() => onSave([...selected.values()])}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setSelected(new Set([]))}
                                disabled={selected.size === 0}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
