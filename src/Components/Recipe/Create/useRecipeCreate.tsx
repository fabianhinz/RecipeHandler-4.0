import { useSnackbar } from 'notistack'
import { useState } from 'react'

import { AttachmentMetadata, Recipe } from '../../../model/model'
import { isData } from '../../../model/modelUtil'
import { FirebaseService } from '../../../services/firebase'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { RecipeCreateState } from './RecipeCreateReducer'

export const useRecipeCreate = (state: RecipeCreateState, editedRecipe: boolean | undefined) => {
    const [changesSaved, setChangesSaved] = useState(false)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const { history } = useRouterContext()
    const { user } = useFirebaseAuthContext()

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

    const uploadAttachments = async () => {
        // const uploadAttachments = FirebaseService.functions.httpsCallable('uploadAttachments')
        // uploadAttachments({
        //     attachments: [
        //         { dataUrl: '', name: 'first', size: 1 },
        //         { dataUrl: '', name: 'second', size: 2 },
        //     ],
        // } as Pick<Recipe<AttachmentData>, 'attachments'>).then(result => console.log(result))

        const attachmentSnackbar = enqueueSnackbar('Bilder werden verarbeitet', {
            persist: true,
            variant: 'info',
        })

        if (state.storageDeleteRefs) {
            try {
                for (const ref of state.storageDeleteRefs) {
                    await ref.delete()
                }
            } catch (e) {
                // ? possible exeption is 'storage/object-not-found'
                // we don't care, move on
                console.log(e)
            }
        }

        const uploadTasks: Array<PromiseLike<any>> = []
        const oldMetadata: Array<AttachmentMetadata> = []
        for (const attachment of state.attachments) {
            if (!isData(attachment)) {
                // ? old Metadata indicates that those attachments are already uploaded
                oldMetadata.push(attachment)
                continue
            }
            const uploadTask = FirebaseService.storageRef
                .child(`recipes/${state.name}/${attachment.name}`)
                .putString(attachment.dataUrl, 'data_url')
                .catch(error =>
                    enqueueSnackbar(error.message, {
                        variant: 'error',
                    })
                )
            uploadTasks.push(uploadTask)
        }

        const finishedTasks = await Promise.all(uploadTasks)
        const newMetadata: Array<AttachmentMetadata> = []
        finishedTasks.forEach((snapshot: firebase.storage.UploadTaskSnapshot) => {
            // ? on "storage/unauthorized" snapshot is not of type "object"
            if (typeof snapshot !== 'object') return
            const { fullPath, size, name } = snapshot.metadata
            newMetadata.push({
                fullPath,
                name,
                size,
            })
        })

        closeSnackbar(attachmentSnackbar as string)
        return { newMetadata, oldMetadata }
    }

    const saveRecipeDocument = async (args: {
        newMetadata: Array<AttachmentMetadata>
        oldMetadata: Array<AttachmentMetadata>
    }) => {
        const { oldMetadata, newMetadata } = args

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
                    attachments: [...oldMetadata, ...newMetadata],
                    numberOfComments: state.numberOfComments,
                    categories: state.categories,
                    relatedRecipes: state.relatedRecipes,
                    createdDate: FirebaseService.createTimestampFromDate(new Date()),
                    editorUid: user!.uid,
                } as Recipe<AttachmentMetadata>)

            if (!editedRecipe) {
                await FirebaseService.firestore
                    .collection('rating')
                    .doc(state.name)
                    .set({ value: 0 })
            }

            enqueueSnackbar(`${state.name} gespeichert`, {
                variant: 'success',
            })
            setChangesSaved(true)
            history.push(PATHS.home)
        } catch {
            enqueueSnackbar('fehlende Berechtigungen', { variant: 'error' })
        } finally {
            closeSnackbar(saveSnackbar as string)
        }
    }

    return { validate, uploadAttachments, saveRecipeDocument, changesSaved }
}
