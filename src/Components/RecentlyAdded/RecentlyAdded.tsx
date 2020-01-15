import { Card, Grid } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'

import { RecipeDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { usePinnedRecipesContext } from '../Provider/PinnedRecipesProvider'
import RecentlyAddedCard, { recentlyAddedGridProps } from './RecentlyAddedCard'

const RecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const { isLowRes, isHighRes } = useBreakpointsContext()
    const { pinnedOnDesktop } = usePinnedRecipesContext()

    const limit = isLowRes ? 3 : isHighRes ? 12 : 6

    useEffect(() => {
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        return query
            .orderBy('createdDate', 'desc')
            .limit(limit)
            .onSnapshot(
                querySnapshot => {
                    setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                },
                error => console.error(error)
            )
    }, [limit])

    return (
        <Grid container spacing={2}>
            {recipes.map(recipe => (
                <RecentlyAddedCard skeleton={false} key={recipe.name} recipe={recipe} />
            ))}
            {recipes.length === 0 &&
                new Array(limit).fill(1).map((_skeleton, index) => (
                    <Grid {...recentlyAddedGridProps(isHighRes, pinnedOnDesktop)} item key={index}>
                        <Grid container spacing={2} justify="space-between" alignItems="center">
                            <Grid xs={12} item>
                                <Card>
                                    <Skeleton width="100%" height={112} variant="rect" />
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
        </Grid>
    )
}

export default RecentlyAdded
