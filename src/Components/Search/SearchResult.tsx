import React, { useEffect, useState } from 'react'

import { Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import HomeRecipeCard from '../Home/HomeRecipeCard'
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

export default SearchResult
