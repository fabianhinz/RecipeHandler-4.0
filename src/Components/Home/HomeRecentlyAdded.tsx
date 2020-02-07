import { Grid, Typography } from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'

import { Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import Skeletons from '../Shared/Skeletons'
import HomeRecipeCard from './HomeRecipeCard'

const HomeRecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<Recipe>>([])

    const { user } = useFirebaseAuthContext()
    const { isLowRes } = useBreakpointsContext()

    const limit = useMemo(() => (isLowRes ? 3 : 6), [isLowRes])

    useEffect(() => {
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        return query
            .orderBy('createdDate', 'desc')
            .limit(limit)
            .onSnapshot(
                querySnapshot => {
                    setRecipes(querySnapshot.docs.map(doc => doc.data() as Recipe))
                },
                error => console.error(error)
            )
    }, [limit])

    if (user && !user.showRecentlyAdded) return <></>

    return (
        <>
            <Grid item>
                <Typography variant="h4">Kürzlich hinzugefügt</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    {recipes.map(recipe => (
                        <HomeRecipeCard key={recipe.name} recipe={recipe} />
                    ))}
                    <Skeletons
                        variant="home"
                        visible={recipes.length === 0}
                        numberOfSkeletons={limit}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default HomeRecentlyAdded
