import { useSnackbar } from 'notistack'
import { useState } from 'react'

import { Recipe, User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { RecipeCreateState } from './RecipeCreateReducer'

export const useRecipeCreate = (state: RecipeCreateState, editedRecipe?: boolean) => {
    const [changesSaved, setChangesSaved] = useState(false)

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
                enqueueSnackbar(`Rezept mit dem Namen ${state.name} existiert bereits`, {
                    variant: 'warning',
                })
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

        try {
            await FirebaseService.firestore
                .collection('recipes')
                .doc(state.name)
                .set({
                    name: state.name,
                    ingredients: state.ingredients,
                    amount: state.amount,
                    description: state.description,
                    numberOfComments: state.numberOfComments,
                    categories: state.categories,
                    relatedRecipes: state.relatedRecipes,
                    createdDate: FirebaseService.createTimestampFromDate(new Date()),
                    editorUid: state.editorUid || user!.uid,
                } as Recipe)

            if (!editedRecipe) {
                await FirebaseService.firestore
                    .collection('cookCounter')
                    .doc(state.name)
                    .set({ value: 0 })
            }

            enqueueSnackbar(`${state.name} gespeichert`, {
                variant: 'success',
            })
            setChangesSaved(true)
            history.push(PATHS.home)
        } catch (e) {
            enqueueSnackbar('fehlende Berechtigungen', { variant: 'error' })
        } finally {
            closeSnackbar(saveSnackbar as string)
        }
    }

    return { validate, saveRecipeDocument, changesSaved }
}
