import {
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    TextField,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import clsx from 'clsx'
import React, { FC, useEffect, useState } from 'react'

import useDebounce from '../../../hooks/useDebounce'
import { RecipeDocument } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { BORDER_RADIUS } from '../../../theme'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import Progress from '../../Shared/Progress'
import { SlideUp } from '../../Shared/Transitions'
import RecipeResultHeader from '../Result/RecipeResultHeader'

interface RecipeCreateRelatedDialogProps {
    defaultValues: Array<string>
    currentRecipeName: string
    open: boolean
    onSave: (relatedRecipes: Array<string>) => void
    onClose: () => void
}
// ToDo change color scheme
const useStyles = makeStyles(theme =>
    createStyles({
        recipeHeader: {
            cursor: 'pointer',
            padding: theme.spacing(2),
            borderRadius: 0,
            transition: theme.transitions.create('background-color', {
                duration: theme.transitions.duration.short,
            }),
            '&:first-child': {
                borderRadius: `${BORDER_RADIUS}px ${BORDER_RADIUS}px 0 0`,
            },
            '&:last-child': {
                borderRadius: `0 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px `,
            },
            '@media (pointer: fine)': {
                '&:hover': {
                    backgroundColor: 'rgb(90, 139, 92, 0.15)',
                },
            },
        },
        selectedRecipeHeader: {
            backgroundColor: 'rgb(90, 139, 92, 0.3)',
            '&:hover': {
                backgroundColor: 'rgb(90, 139, 92, 0.45)',
            },
        },
    })
)

const endAt = (debouncedSearchValue: string) => {
    // https://stackoverflow.com/a/57290806
    return debouncedSearchValue.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))
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

    const classes = useStyles()

    const debouncedSearchValue = useDebounce(searchValue, 500)
    const { isDialogFullscreen } = useBreakpointsContext()

    useEffect(() => {
        if (!open) return

        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes').limit(10)

        setLoading(true)

        const handleSnapshot = (querySnapshot: firebase.firestore.QuerySnapshot) => {
            setRecipes(
                querySnapshot.docs
                    .map(doc => doc.data() as RecipeDocument)
                    .filter(recipe => recipe.name !== currentRecipeName)
            )
            setLoading(false)
        }

        if (defaultValues.length === 0 && debouncedSearchValue.length === 0)
            return query.orderBy('createdDate', 'desc').onSnapshot(handleSnapshot)
        else if (debouncedSearchValue.length > 0)
            return query
                .orderBy('name', 'asc')
                .where('name', '>=', debouncedSearchValue)
                .where('name', '<', endAt(debouncedSearchValue))
                .onSnapshot(handleSnapshot)
        else
            return query
                .orderBy('name', 'asc')
                .startAt(defaultValues.sort()[0])
                .onSnapshot(handleSnapshot)
    }, [open, debouncedSearchValue, defaultValues, currentRecipeName])

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
            fullScreen={isDialogFullscreen}
            TransitionComponent={SlideUp}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth>
            <DialogTitle>Passende Rezepte auswählen</DialogTitle>
            <DialogContent>
                {loading && <Progress variant="cover" />}
                {recipes.map(recipe => (
                    <div
                        key={recipe.name}
                        onClick={() => handleSelectedChange(recipe.name)}
                        className={clsx(
                            classes.recipeHeader,
                            selected.has(recipe.name) && classes.selectedRecipeHeader
                        )}>
                        <RecipeResultHeader variant="related" recipe={recipe} />
                    </div>
                ))}
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            helperText="Groß- und Kleinschreibung beachten"
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
