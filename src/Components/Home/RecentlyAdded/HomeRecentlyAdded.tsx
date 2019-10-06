import {
    Box,
    createStyles,
    Divider,
    Drawer,
    Fab,
    Grid,
    InputBase,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Tooltip,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React, { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'

import { index } from '../../../algolia'
import { FirebaseService } from '../../../firebase'
import useDebounce from '../../../hooks/useDebounce'
import { RecipeDocument } from '../../../model/model'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { HomeRecentlyAddedCard } from './HomeRecentlyAddedCard'

const useStyles = makeStyles(() =>
    createStyles({
        highlight: {
            color: 'black',
            backgroundColor: 'orange',
        },
    })
)

type Hit = Pick<RecipeDocument, 'name' | 'description' | 'ingredients'> & {
    _highlightResult: {
        name: { value: string }
        description: { value: string }
        ingredients: { value: string }
    }
}

type Hits = Array<Hit>

const getHighlightedDescription = (description: string) => {
    const descriptionArray = description.split(/1\.|- |\*{1,}|#{1,}/gi)
    const displayResults = new Array<string>()
    const displayResultsNice = new Array<string>()

    descriptionArray.forEach(step => {
        if (step.indexOf('<em>') !== -1) {
            displayResults.push('...')
            displayResults.push(step)
        }
    })

    displayResults.forEach(recipeFragment => {
        displayResultsNice.push(recipeFragment.replace(/<\/?em>/gi, ''))
    })

    return displayResultsNice
}

const getHighlightedIngredients = (ingredients: string) => {
    const ingredientsArray = ingredients.split('- ')

    const displayResults = new Array<string>()
    const displayResultsNice = new Array<string>()

    ingredientsArray.forEach(ingredient => {
        if (ingredient.indexOf('<em>') !== -1) {
            displayResults.push('...')
            displayResults.push(ingredient)
        }
    })

    displayResults.forEach(recipeFragment => {
        displayResultsNice.push(recipeFragment.replace(/<\/?em>/gi, ''))
    })

    return displayResultsNice
}

export const HomeRecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const [searchDrawer, setSearchDrawer] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [algoliaHits, setAlgoliaHits] = useState<Hits>([])
    const { isMobile } = useBreakpointsContext()

    const classes = useStyles()

    const debouncedSearchValue = useDebounce(searchValue, 500)
    const { history } = useRouterContext()

    const handleSearchDrawerChange = () => setSearchDrawer(previous => !previous)

    useEffect(() => {
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        const limit = isMobile ? 3 : 6

        if (debouncedSearchValue.length > 0) {
            index.search(debouncedSearchValue).then(({ hits }) => setAlgoliaHits(hits))
        } else {
            setAlgoliaHits([])
        }

        return query
            .orderBy('createdDate', 'desc')
            .limit(limit)
            .onSnapshot(
                querySnapshot => {
                    setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                },
                error => console.error(error)
            )
    }, [debouncedSearchValue, isMobile])

    return (
        <>
            <Box marginBottom={2}>
                <Box marginBottom={2} display="flex" justifyContent="space-evenly">
                    <Tooltip title="Kürzlich hinzugefügte einschränken">
                        <div>
                            <Fab onClick={handleSearchDrawerChange} size="small" color="primary">
                                <SearchIcon />
                            </Fab>
                        </div>
                    </Tooltip>
                </Box>
                <Grid container spacing={2}>
                    {recipes.map(recipe => (
                        <HomeRecentlyAddedCard skeleton={false} key={recipe.name} recipe={recipe} />
                    ))}
                </Grid>
            </Box>

            <Drawer open={searchDrawer} onClose={handleSearchDrawerChange} anchor="top">
                <Box padding={2} display="flex" alignItems="center">
                    <Box marginRight={1}>
                        <SearchIcon />
                    </Box>
                    <InputBase
                        autoFocus
                        fullWidth
                        placeholder="Rezepte durchsuchen"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                </Box>

                <Divider />

                {algoliaHits.length > 0 && (
                    <List>
                        {algoliaHits.map(recipeHit => (
                            <ListItem
                                button
                                onClick={() => history.push(PATHS.details(recipeHit.name))}
                                key={recipeHit.name}>
                                <ListItemText
                                    primary={recipeHit.name}
                                    secondary={
                                        <>
                                            <b>Zutaten:</b>{' '}
                                            {getHighlightedIngredients(
                                                recipeHit._highlightResult.ingredients.value
                                            ).map((recipeFragment, index) => (
                                                <Highlighter
                                                    searchWords={[debouncedSearchValue]}
                                                    textToHighlight={recipeFragment}
                                                    key={index}
                                                />
                                            ))}
                                            <br />
                                            <b>Beschreibung:</b>{' '}
                                            {getHighlightedDescription(
                                                recipeHit._highlightResult.description.value
                                            ).map((recipeFragment, index) => (
                                                <Highlighter
                                                    searchWords={[debouncedSearchValue]}
                                                    textToHighlight={recipeFragment}
                                                    key={index}
                                                />
                                            ))}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Drawer>
        </>
    )
}
