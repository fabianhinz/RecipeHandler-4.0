import { onSnapshot } from 'firebase/firestore'
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
      setState({ loading: false, recipe })
    }

    onSnapshot(resolveDoc('recipes', props.recipeName), documentSnapshot => {
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
    })

    return () => {
      mounted = false
    }
  }, [location.state, props.recipeName])

  return { recipeDoc: state.recipe, recipeDocLoading: state.loading }
}
