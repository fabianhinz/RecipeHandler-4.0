import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    Drawer,
    Fab,
    Grid,
    InputBase,
    List,
    ListItem,
    ListSubheader,
    makeStyles,
    Tooltip,
    Typography,
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
        root: {
            background: 'none',
        },
        highlight: {
            background: 'fff2ac',
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

    displayResults.push('...')
    descriptionArray.forEach(step => {
        if (step.indexOf('<em>') !== -1) {
            displayResults.push(step)
        }
    })
    displayResults.push('...')

    displayResults.forEach(recipeFragment => {
        displayResultsNice.push(recipeFragment.replace(/<\/?em>/gi, ''))
    })

    return displayResultsNice
}

const getHighlightedIngredients = (ingredients: string) => {
    const ingredientsArray = ingredients.split('- ')

    const displayResults = new Array<string>()
    const displayResultsNice = new Array<string>()

    displayResults.push('...')
    ingredientsArray.forEach(ingredient => {
        if (ingredient.indexOf('<em>') !== -1) {
            displayResults.push(ingredient)
        }
    })
    displayResults.push('...')

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

    const debouncedSearchValue = useDebounce(searchValue, 500)
    const { history } = useRouterContext()
    const classes = useStyles()

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

            <Drawer
                BackdropProps={{ classes }}
                open={searchDrawer}
                onClose={handleSearchDrawerChange}
                anchor="top">
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

                {/* {algoliaHits.length > 0 && (
                    <List>
                        {algoliaHits.map(recipeHit => (
                            <ListItem onClick={() => history.push(PATHS.details(recipeHit.name))}>
                                <ListSubheader>{recipeHit.name}</ListSubheader>
                                <ListSubheader>Zutaten:</ListSubheader>
                                {getHighlightedIngredients(
                                    recipeHit._highlightResult.ingredients.value
                                ).map(recipeFragment => (
                                    <ListItem>
                                        <Highlighter
                                            searchWords={[debouncedSearchValue]}
                                            textToHighlight={recipeFragment}
                                        />
                                    </ListItem>
                                ))}
                                <ListSubheader>Beschreibung:</ListSubheader>
                                {getHighlightedDescription(
                                    recipeHit._highlightResult.description.value
                                ).map(recipeFragment => (
                                    <ListItem>
                                        <Highlighter
                                            searchWords={[debouncedSearchValue]}
                                            textToHighlight={recipeFragment}
                                        />
                                    </ListItem>
                                ))}
                            </ListItem>
                        ))}
                    </List>
                )} */}

                {algoliaHits.length > 0 && (
                    <Box padding={2}>
                        <Grid container spacing={2}>
                            {algoliaHits.map(recipeHit => (
                                <Grid item xs={12} md={6} lg={4} key={recipeHit.name}>
                                    <Card>
                                        <CardActionArea
                                            onClick={() =>
                                                history.push(PATHS.details(recipeHit.name))
                                            }>
                                            <CardHeader title={recipeHit.name} />
                                        </CardActionArea>
                                        <CardContent>
                                            <Typography variant="subtitle2">Zutaten:</Typography>
                                            {getHighlightedIngredients(
                                                recipeHit._highlightResult.ingredients.value
                                            ).map(recipeFragment => (
                                                <ul className={classes.highlight}>
                                                    <Highlighter
                                                        searchWords={[debouncedSearchValue]}
                                                        textToHighlight={recipeFragment}
                                                    />
                                                </ul>
                                            ))}
                                            <Typography variant="subtitle2">
                                                Beschreibung:
                                            </Typography>
                                            {getHighlightedDescription(
                                                recipeHit._highlightResult.description.value
                                            ).map(recipeFragment => (
                                                <ul className={classes.highlight}>
                                                    <Highlighter
                                                        searchWords={[debouncedSearchValue]}
                                                        textToHighlight={recipeFragment}
                                                    />
                                                </ul>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Drawer>
        </>
    )
}
