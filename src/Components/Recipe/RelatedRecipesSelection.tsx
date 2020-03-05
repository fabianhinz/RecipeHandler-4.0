import {
    CardActionArea,
    createStyles,
    Grid,
    InputBase,
    makeStyles,
    Typography,
} from '@material-ui/core'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import useDebounce from '../../hooks/useDebounce'
import { Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import SelectionDrawer from '../Shared/SelectionDrawer'
import Skeletons from '../Shared/Skeletons'

const useStyles = makeStyles(theme =>
    createStyles({
        recipeHeader: {
            cursor: 'pointer',
            padding: theme.spacing(2),
            borderRadius: BORDER_RADIUS,
            transition: theme.transitions.create('background-color', {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeOut,
            }),
        },
        selectedRecipeHeader: {
            backgroundColor: 'rgb(90, 139, 92, 0.3)',
            '&:hover': {
                backgroundColor: 'rgb(90, 139, 92, 0.45)',
            },
        },
        inputBaseRoot: {
            width: '100%',
            ...theme.typography.h5,
        },
        inputBaseInput: {
            fontFamily: 'Ubuntu',
            padding: theme.spacing(1),
        },
    })
)

const endAt = (debouncedSearchValue: string) => {
    // https://stackoverflow.com/a/57290806
    return debouncedSearchValue.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))
}

interface Props {
    relatedRecipes: string[]
    onRelatedRecipesChange: (relatedRecipes: string[]) => void
}

const RelatedRecipesSelection = ({ relatedRecipes, onRelatedRecipesChange }: Props) => {
    const [loading, setLoading] = useState(true)
    const [shouldLoad, setShouldLoad] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [recipes, setRecipes] = useState<Array<Recipe>>([])

    const debouncedSearchValue = useDebounce(searchValue, 500)

    const classes = useStyles()

    useEffect(() => {
        if (!shouldLoad) return

        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes').limit(10)

        const handleSnapshot = (querySnapshot: firebase.firestore.QuerySnapshot) => {
            setLoading(false)
            setRecipes(querySnapshot.docs.map(doc => doc.data() as Recipe))
        }

        if (debouncedSearchValue.length > 0) {
            return query
                .orderBy('name', 'asc')
                .where('name', '>=', debouncedSearchValue)
                .where('name', '<', endAt(debouncedSearchValue))
                .onSnapshot(handleSnapshot)
        } else {
            return query.orderBy('createdDate', 'desc').onSnapshot(handleSnapshot)
        }
    }, [debouncedSearchValue, shouldLoad])

    const handleSelectedChange = (recipeName: string) => {
        let newRelatedRecipes: string[] = [...relatedRecipes]
        if (relatedRecipes.some(name => name === recipeName)) {
            newRelatedRecipes = newRelatedRecipes.filter(name => name !== recipeName)
        } else {
            newRelatedRecipes.push(recipeName)
        }
        onRelatedRecipesChange(newRelatedRecipes)
    }

    return (
        <SelectionDrawer
            onOpen={() => setShouldLoad(true)}
            onClose={() => setShouldLoad(false)}
            buttonProps={{
                startIcon: <SwapIcon />,
                label: 'Passende Rezepte',
                highlight: relatedRecipes.length > 0,
            }}
            header={
                <InputBase
                    classes={{ root: classes.inputBaseRoot, input: classes.inputBaseInput }}
                    value={searchValue}
                    placeholder="Name"
                    onChange={e => setSearchValue(e.target.value)}
                />
            }>
            <Grid container spacing={2} direction="column">
                {recipes.map(recipe => (
                    <Grid item key={recipe.name} onClick={() => handleSelectedChange(recipe.name)}>
                        <CardActionArea
                            className={clsx(
                                classes.recipeHeader,
                                relatedRecipes.some(name => name === recipe.name) &&
                                    classes.selectedRecipeHeader
                            )}>
                            <Typography gutterBottom display="inline" variant="h5">
                                {recipe.name}
                            </Typography>

                            <Typography color="textSecondary">
                                {FirebaseService.createDateFromTimestamp(
                                    recipe.createdDate
                                ).toLocaleDateString()}
                            </Typography>
                        </CardActionArea>
                    </Grid>
                ))}
                <Skeletons
                    visible={loading}
                    variant="relatedRecipesSelection"
                    numberOfSkeletons={10}
                />
            </Grid>
        </SelectionDrawer>
    )
}

export default RelatedRecipesSelection
