import { Box, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { FirebaseService } from '../../../firebase'
import { RecipeDocument } from '../../../model/model'
import { useBreakpointsContext } from '../../Provider/BreakpointsProvider'
import { HomeRecentlyAddedCard } from './HomeRecentlyAddedCard'

export const HomeRecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const { isLowRes, isHighRes } = useBreakpointsContext()

    useEffect(() => {
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        const limit = isLowRes ? 3 : isHighRes ? 12 : 6

        return query
            .orderBy('createdDate', 'desc')
            .limit(limit)
            .onSnapshot(
                querySnapshot => {
                    setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                },
                error => console.error(error)
            )
    }, [isHighRes, isLowRes])

    return (
        <Box marginBottom={2}>
            <Grid container spacing={2}>
                {recipes.map(recipe => (
                    <HomeRecentlyAddedCard skeleton={false} key={recipe.name} recipe={recipe} />
                ))}
            </Grid>
        </Box>
    )
}
