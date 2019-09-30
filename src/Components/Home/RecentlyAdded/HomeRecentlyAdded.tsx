import {
    Box,
    createStyles,
    Drawer,
    Fab,
    Grid,
    InputBase,
    makeStyles,
    Tooltip,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchTwoTone'
import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../../firebase'
import useDebounce from '../../../hooks/useDebounce'
import { RecipeDocument } from '../../../model/model'
import { HomeRecentlyAddedCard } from './HomeRecentlyAddedCard'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            background: 'none',
        },
    })
)

export const HomeRecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const [searchDrawer, setSearchDrawer] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [skeleton, setSkeleton] = useState(false)

    const debouncedSearchValue = useDebounce(searchValue, 500)

    const classes = useStyles()

    const handleSearchDrawerChange = () => setSearchDrawer(previous => !previous)

    useEffect(() => {
        if (searchValue !== debouncedSearchValue) setSkeleton(true)
        else setSkeleton(false)
    }, [debouncedSearchValue, searchValue])

    useEffect(() => {
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        if (debouncedSearchValue.length > 0) {
            return query
                .where('name', '>=', debouncedSearchValue)
                .limit(6)
                .onSnapshot(
                    querySnapshot => {
                        setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                        setSkeleton(false)
                    },
                    error => console.error(error)
                )
        } else {
            return query
                .orderBy('createdDate', 'desc')
                .limit(6)
                .onSnapshot(
                    querySnapshot => {
                        setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                    },
                    error => console.error(error)
                )
        }
    }, [debouncedSearchValue])

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
                        <HomeRecentlyAddedCard
                            skeleton={skeleton}
                            key={recipe.name}
                            recipe={recipe}
                        />
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
                        placeholder="Nach Rezeptnamen suchen"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                </Box>
            </Drawer>
        </>
    )
}
