import { Timestamp } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useRouterContext } from '@/Components/Provider/RouterProvider'
import { PATHS } from '@/Components/Routes/Routes'
import { MostCooked, Recipe, User } from '@/model/model'
import { FirebaseService } from '@/services/firebase'
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
      const documentSnapshot = await FirebaseService.firestore
        .collection('recipes')
        .doc(state.name)
        .get()

      if (documentSnapshot.exists && !editedRecipe) {
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
      editorUid: state.editorUid || user!.uid,
    }

    try {
      await FirebaseService.firestore
        .collection('recipes')
        .doc(recipeName)
        .set(recipeDoc, { merge: true })

      if (!editedRecipe) {
        await FirebaseService.firestore
          .collection('cookCounter')
          .doc(recipeName)
          .set({
            value: 0,
            createdDate,
          } as MostCooked<number>)
      }

      if (state.selectedTrial) {
        await FirebaseService.firestore
          .collection('trials')
          .doc(state.selectedTrial.name)
          .delete()

        await FirebaseService.storageRef
          .child(state.selectedTrial.fullPath)
          .delete()
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
