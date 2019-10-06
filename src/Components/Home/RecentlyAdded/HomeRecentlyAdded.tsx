import {
    Box,
    Card,
    CardActionArea,
    CardHeader,
    createStyles,
    Divider,
    Drawer,
    Fab,
    Grid,
    InputBase,
    makeStyles,
    Tooltip,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React, { useEffect, useState } from 'react'

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
    })
)

type Hits = Array<
    Pick<RecipeDocument, 'name' | 'description' | 'ingredients'> & {
        _highlightResult: {
            name: { value: string }
            description: { value: string }
            ingredients: { value: string }
        }
    }
>

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
                                        {/* <CardContent>
                                        <ReactMarkdown
                                            source={recipeHit._highlightResult.ingredients.value}
                                        />
                                        <ReactMarkdown
                                            source={recipeHit._highlightResult.description.value}
                                        />
                                    </CardContent> */}
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
