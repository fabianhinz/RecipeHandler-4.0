import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Recipe } from '../model/model'
import { FirebaseService } from '../services/firebase'

type RecipesCollectionState = { loading: boolean; recipe: Recipe | null }
type RecipeLocation = Pick<RecipesCollectionState, 'recipe'>

const initialState: RecipesCollectionState = {
    loading: true,
    recipe: null,
}

type Props = {
    recipeName: string
}

export const useRecipeDoc = (props: Props) => {
    const [state, setState] = useState<RecipesCollectionState>(initialState)
    const location = useLocation()

    useEffect(() => {
        setState(initialState)
    }, [location.pathname])

    useEffect(() => {
        let mounted = true

        const recipe = location.state && (location.state as RecipeLocation).recipe

        if (recipe) {
            setState({ loading: false, recipe })
        } else {
            FirebaseService.firestore
                .collection('recipes')
                .doc(props.recipeName)
                .get()
                .then(documentSnapshot => {
                    if (!mounted) return
                    setState({
                        loading: false,
                        recipe: documentSnapshot.data() as Recipe,
                    })
                })
        }

        return () => {
            mounted = false
        }
    }, [location.state, props.recipeName])

    return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}
