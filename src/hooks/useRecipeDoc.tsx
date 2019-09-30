import { useEffect, useState } from 'react'

import { FirebaseService } from '../firebase'
import { AttachementMetadata, Recipe, RouteWithRecipeName } from '../model/model'

type RecipesCollectionState = { loading: boolean; recipe: Recipe<AttachementMetadata> | null }

export const useRecipeDoc = (options: {
    routeProps?: RouteWithRecipeName
    recipeName?: string | null
}) => {
    const [state, setState] = useState<RecipesCollectionState>({
        loading: true,
        recipe: null,
    })

    useEffect(() => {
        if (options.routeProps) {
            const { location, match } = options.routeProps
            if (location.state && location.state.recipe) {
                setState({ loading: false, recipe: location.state.recipe })
            } else {
                FirebaseService.firestore
                    .collection('recipes')
                    .doc(match.params.name)
                    .get()
                    .then(documentSnapshot => {
                        setState({
                            loading: false,
                            recipe: documentSnapshot.data() as Recipe<AttachementMetadata>,
                        })
                    })
            }
        } else if (options.recipeName) {
            FirebaseService.firestore
                .collection('recipes')
                .doc(options.recipeName)
                .get()
                .then(documentSnapshot => {
                    setState({
                        loading: false,
                        recipe: documentSnapshot.data() as Recipe<AttachementMetadata>,
                    })
                })
        }
    }, [options.recipeName, options.routeProps])

    return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}
