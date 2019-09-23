import { useEffect, useState } from "react";
import { FirebaseService } from "../firebase";
import { Recipe, AttachementMetadata, RouteWithRecipeName } from "../model/model"

type RecipesCollectionState = { loading: boolean, recipe: Recipe<AttachementMetadata> | null }

export const useRecipeDoc = ({ location, match }: RouteWithRecipeName) => {
    const [state, setState] = useState<RecipesCollectionState>({
        loading: true,
        recipe: null
    });

    useEffect(() => {
        if (location.state && location.state.recipe) {
            setState({ loading: false, recipe: location.state.recipe });
        } else {
            FirebaseService.firestore.collection("recipes").doc(match.params.name).get().then(
                documentSnapshot => {
                    setState({ loading: false, recipe: documentSnapshot.data() as Recipe<AttachementMetadata> })
                }
            )
        }
    }, [location.state, match.params.name])

    return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}