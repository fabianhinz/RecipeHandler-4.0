import { useEffect, useState } from 'react'

import { Recipe, RouteWithRecipeName } from '../model/model'
import { FirebaseService } from '../services/firebase'

type RecipesCollectionState = { loading: boolean; recipe: Recipe | null }
type RecipeLocation = Pick<RecipesCollectionState, 'recipe'>

interface Options {
    routeProps: RouteWithRecipeName
}

export const useRecipeDoc = ({ routeProps }: Options) => {
    const [state, setState] = useState<RecipesCollectionState>({
        loading: true,
        recipe: null,
    })

    useEffect(() => {
        let mounted = true

        const { location, match } = routeProps
        const recipe = location.state && (location.state as RecipeLocation).recipe

        if (recipe) {
            setState({ loading: false, recipe })
        } else {
            FirebaseService.firestore
                .collection('recipes')
                .doc(match.params.name)
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
    }, [routeProps])

    return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}
