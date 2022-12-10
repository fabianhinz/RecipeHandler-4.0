import { deleteDoc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useSnackbar } from 'notistack'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useRouterContext } from '@/Components/Provider/RouterProvider'
import { PATHS } from '@/Components/Routes/Routes'
import { storage } from '@/firebase/firebaseConfig'
import { resolveDoc } from '@/firebase/firebaseQueries'
import { MostCooked, Recipe, User } from '@/model/model'
import { getRecipeService } from '@/services/recipeService'

import { RecipeCreateState } from './RecipeCreateReducer'

export const useRecipeCreate = (
  state: RecipeCreateState,
  editedRecipe?: boolean
) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { history } = useRouterContext()

  // ? create is a securedRoute (Routes.tsx) >> user should not be null
  const { user } = useFirebaseAuthContext() as { user: User }

  const validate = async (selectedCategories: Map<string, string>) => {
    let valid = true
    if (selectedCategories.size === 0 || state.name.length === 0) {
      enqueueSnackbar(
        'Das Rezept sollte um mindestens eine Kategorie und den Namen ergänzt werden',
        {
          variant: 'warning',
        }
      )
      valid = false
    }

    try {
      const documentSnapshot = await getDoc(resolveDoc('recipes', state.name))

      if (documentSnapshot.exists() && !editedRecipe) {
        enqueueSnackbar(
          `Rezept mit dem Namen ${state.name} existiert bereits`,
          {
            variant: 'warning',
          }
        )
        valid = false
      }
    } catch (e) {
      valid = false
    }

    return valid
  }

  const saveRecipeDocument = async () => {
    const saveSnackbar = enqueueSnackbar('Rezept wird gespeichert', {
      persist: true,
      variant: 'info',
    })

    const createdDate = Timestamp.fromDate(new Date())

    const recipeName = state.name.trim()
    const recipeDoc: Recipe = {
      name: recipeName,
      ingredients: state.ingredients,
      amount: state.amount,
      description: state.description,
      numberOfComments: state.numberOfComments,
      numberOfAttachments: state.numberOfAttachments,
      categories: state.categories,
      relatedRecipes: state.relatedRecipes,
      createdDate,
      editorUid: state.editorUid || user.uid,
    }

    try {
      await setDoc(resolveDoc('recipes', recipeName), recipeDoc, {
        merge: true,
      })

      if (!editedRecipe) {
        const cookCounterDoc: MostCooked<number> = { value: 0, createdDate }
        await setDoc(resolveDoc('cookCounter', recipeName), cookCounterDoc)
      }

      if (state.selectedTrial) {
        await Promise.all([
          deleteDoc(resolveDoc('trials', state.selectedTrial.name)),
          deleteObject(ref(storage, state.selectedTrial.fullPath)),
        ])
      }

      getRecipeService().recipeCreateState = null
      enqueueSnackbar(`${recipeName} gespeichert`, {
        variant: 'success',
      })

      history.push(PATHS.home)
    } catch (e) {
      enqueueSnackbar('fehlende Berechtigungen', { variant: 'error' })
    } finally {
      closeSnackbar(saveSnackbar as string)
    }
  }

  return { validate, saveRecipeDocument }
}
