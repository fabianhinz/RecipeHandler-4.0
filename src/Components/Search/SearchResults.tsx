import { Grid } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import HomeRecipeCard from '../Home/HomeRecipeCard'
import { useSearchResultsContext } from '../Provider/SearchResultsProvider'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import Skeletons from '../Shared/Skeletons'

interface SearchResultProps {
    name: string
}

const SearchResult = ({ name }: SearchResultProps) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null)

    useEffect(() => {
        let mounted = true
        FirebaseService.firestore
            .collection('recipes')
            .doc(name)
            .get()
            .then(docSnapshot => {
                if (mounted) setRecipe(docSnapshot.data() as Recipe)
            })

        return () => {
            mounted = false
        }
    }, [name])

    return (
        <>
            {recipe ? (
                <HomeRecipeCard recipe={recipe} />
            ) : (
                <Skeletons visible variant="recipe" numberOfSkeletons={1} />
            )}
        </>
    )
}

const SearchResults = () => {
    const { error, hits } = useSearchResultsContext()
    const { enqueueSnackbar } = useSnackbar()

    useDocumentTitle('Ergebnisse')

    useEffect(() => {
        if (error) enqueueSnackbar('Fehler beim Abrufen der Daten', { variant: 'error' })
    }, [enqueueSnackbar, error])

    return (
        <EntryGridContainer>
            {hits.length === 20 && (
                <Grid item xs={12}>
                    <Alert color="info">Maximale Anzahl an Suchergebnissen erreicht</Alert>
                </Grid>
            )}

            {hits.map(hit => (
                <SearchResult key={hit.name} name={hit.name} />
            ))}
            <NotFound visible={hits.length === 0} />
        </EntryGridContainer>
    )
}

export default SearchResults
