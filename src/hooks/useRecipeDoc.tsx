import { onSnapshot, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { resolveDoc } from '@/firebase/firebaseQueries'
import { Nullable, Recipe } from '@/model/model'

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
  const location = useLocation<Nullable<RecipeLocation>>()

  useEffect(() => {
    let mounted = true

    const recipe = location.state?.recipe

    if (recipe) {
      setState({
        loading: false,
        recipe: {
          ...recipe,
          // ? the location state only contains a pojo, so we need to explicitly convert the Timestamp
          createdDate: new Timestamp(
            recipe.createdDate.seconds,
            recipe.createdDate.nanoseconds
          ),
        },
      })
    }

    const unsubscribe = onSnapshot(
      resolveDoc('recipes', props.recipeName),
      documentSnapshot => {
        if (!mounted) {
          return
        }
        if (!documentSnapshot.exists() && recipe) {
          return
        }

        setState({
          loading: false,
          recipe: documentSnapshot.data() as Recipe,
        })
      }
    )

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [location.state, props.recipeName])

  return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}
