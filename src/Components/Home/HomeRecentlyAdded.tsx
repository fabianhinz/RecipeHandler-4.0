import { Grid, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { RecipeDocument } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import HomeRecipeCard from './HomeRecipeCard'
import HomeSkeletons from './HomeSkeletons'

const HomeRecentlyAdded = () => {
    const [recipes, setRecipes] = useState<Array<RecipeDocument>>([])
    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = FirebaseService.firestore.collection('recipes')

        return query
            .orderBy('createdDate', 'desc')
            .limit(6)
            .onSnapshot(
                querySnapshot => {
                    setRecipes(querySnapshot.docs.map(doc => doc.data() as RecipeDocument))
                },
                error => console.error(error)
            )
    }, [])

    if (user && !user.showRecentlyAdded) return <></>

    return (
        <>
            <Grid item>
                <Typography variant="h4">Kürzlich hinzugefügt</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="space-evenly" spacing={3}>
                    {recipes.map(recipe => (
                        <HomeRecipeCard key={recipe.name} recipe={recipe} />
                    ))}
                    <HomeSkeletons visible={recipes.length === 0} numberOfSkeletons={6} />
                </Grid>
            </Grid>
        </>
    )
}

export default HomeRecentlyAdded
