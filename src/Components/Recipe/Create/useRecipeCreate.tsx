import { useSnackbar } from 'notistack'

import { MostCooked, Recipe, User } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import recipeService from '../../../services/recipeService'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { RecipeCreateState } from './RecipeCreateReducer'

export const useRecipeCreate = (state: RecipeCreateState, editedRecipe?: boolean) => {
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

        const createdDate = FirebaseService.createTimestampFromDate(new Date())

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
                    createdDate,
                    editorUid: state.editorUid || user!.uid,
                } as Recipe)

            if (!editedRecipe) {
                await FirebaseService.firestore
                    .collection('cookCounter')
                    .doc(state.name)
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

                await FirebaseService.storageRef.child(state.selectedTrial.fullPath).delete()
            }

            recipeService.recipeCreateState = null
            enqueueSnackbar(`${state.name} gespeichert`, {
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
