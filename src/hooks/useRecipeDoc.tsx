import { useEffect, useState } from 'react'

import { AttachmentMetadata, Recipe, RouteWithRecipeName } from '../model/model'
import { FirebaseService } from '../services/firebase'

type RecipesCollectionState = { loading: boolean; recipe: Recipe<AttachmentMetadata> | null }

export const useRecipeDoc = (options: {
    routeProps?: RouteWithRecipeName
    recipeName?: string | null
}) => {
    const [state, setState] = useState<RecipesCollectionState>({
        loading: true,
        recipe: null,
    })

    useEffect(() => {
        let mounted = true

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
                        if (!mounted) return
                        setState({
                            loading: false,
                            recipe: documentSnapshot.data() as Recipe<AttachmentMetadata>,
                        })
                    })
            }
        } else if (options.recipeName) {
            FirebaseService.firestore
                .collection('recipes')
                .doc(options.recipeName)
                .get()
                .then(documentSnapshot => {
                    if (!mounted) return
                    setState({
                        loading: false,
                        recipe: documentSnapshot.data() as Recipe<AttachmentMetadata>,
                    })
                })
        }

        return () => {
            mounted = false
        }
    }, [options.recipeName, options.routeProps])

    return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}
