import { Grid } from '@material-ui/core'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useEffect } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'

import { getRefPaths } from '../../../hooks/useAttachmentRef'
import { useCategorySelect } from '../../../hooks/useCategorySelect'
import { AttachmentMetadata, Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import CategoryWrapper from '../../Category/CategoryWrapper'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'
import RecipeResult from '../Result/RecipeResult'
import { RecipeResultRelated } from '../Result/RecipeResultRelated'
import { RecipeCreateAttachments } from './Attachments/RecipeCreateAttachments'
import { useAttachmentDropzone } from './Attachments/useAttachmentDropzone'
import RecipeCreateDescription from './RecipeCreateDescription'
import RecipeCreateHeader from './RecipeCreateHeader'
import RecipeCreateIngredients from './RecipeCreateIngredients'
import { AttachmentName, CreateChangeKey, useRecipeCreateReducer } from './RecipeCreateReducer'
import { RecipeCreateRelatedDialog } from './RecipeCreateRelatedDialog'
import RecipeCreateSpeedDial from './RecipeCreateSpeedDial'
import { useRecipeCreate } from './useRecipeCreate'

interface RecipeCreateProps extends Pick<RouteComponentProps, 'history' | 'location'> {
    recipe?: Recipe<AttachmentMetadata> | null
    edit?: boolean
}

const RecipeCreate: FC<RecipeCreateProps> = props => {
    const { state, dispatch } = useRecipeCreateReducer(props.recipe)

    const recipeCreateService = useRecipeCreate(state, props.edit)
    const { selectedCategories, setSelectedCategories } = useCategorySelect(props.recipe)
    const { user } = useFirebaseAuthContext()
    const { history } = useRouterContext()
    const { attachments, dropzoneProps } = useAttachmentDropzone(state.attachments)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        dispatch({ type: 'attachmentsDrop', newAttachments: attachments })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachments])

    useEffect(() => {
        dispatch({ type: 'categoriesChange', selectedCategories })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategories])

    useEffect(() => {
        if (!user) history.push(PATHS.home)
    }, [history, user])

    const handleRemoveAttachment = (name: string) => {
        dispatch({ type: 'removeAttachment', name })
    }

    const handleDeleteAttachment = (name: string, fullPath: string) => {
        const { smallPath, mediumPath } = getRefPaths(fullPath)

        const full = FirebaseService.storageRef.child(fullPath)
        const medium = FirebaseService.storageRef.child(smallPath)
        const small = FirebaseService.storageRef.child(mediumPath)

        handleRemoveAttachment(name)
        dispatch({ type: 'storageDeleteRefsChange', refs: [full, medium, small] })
    }

    const handleSaveAttachment = (name: AttachmentName) => {
        closeSnackbar()
        if (state.attachments.filter(a => a.name === name.new).length > 0) {
            enqueueSnackbar('Änderung wird nicht gespeichert. Name bereits vorhanden', {
                variant: 'warning',
            })
        } else {
            dispatch({ type: 'attachmentNameChange', name })
            enqueueSnackbar(`Name von '${name.old}' auf '${name.new}' geändert`, {
                variant: 'success',
            })
        }
    }

    const handleSaveRecipe = useCallback(async () => {
        const valid = await recipeCreateService.validate(selectedCategories)
        if (!valid) return

        const attachmentMetadata = await recipeCreateService.uploadAttachments()
        await recipeCreateService.saveRecipeDocument(attachmentMetadata)
    }, [recipeCreateService, selectedCategories])

    const handleTextFieldChange = (key: CreateChangeKey) => (value: string) => {
        dispatch({ type: 'textFieldChange', key, value })
    }

    const warnOnLocationChange = () => {
        if (props.recipe && !recipeCreateService.changesSaved) {
            return true
        } else if (
            (state.name.length > 0 ||
                Object.keys(state.categories).length > 0 ||
                state.attachments.length > 0 ||
                state.amount > 1 ||
                state.ingredients.length > 0 ||
                state.description.length > 0 ||
                state.relatedRecipes.length > 0) &&
            !recipeCreateService.changesSaved
        )
            return true
        else {
            return false
        }
    }

    return (
        <>
            {state.preview && user ? (
                <RecipeResult
                    variant="preview"
                    recipe={{
                        name: state.name,
                        createdDate: FirebaseService.createTimestampFromDate(new Date()),
                        numberOfComments: 0,
                        categories: state.categories,
                        attachments: state.attachments,
                        ingredients: state.ingredients,
                        amount: state.amount,
                        description: state.description,
                        relatedRecipes: state.relatedRecipes,
                        editor: { uid: user.uid, username: user.username },
                    }}
                />
            ) : (
                <Grid container spacing={4} alignContent="stretch">
                    <Grid item xs={12}>
                        <RecipeCreateHeader
                            inputDisabled={props.edit}
                            name={state.name}
                            onNameChange={handleTextFieldChange('name')}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CategoryWrapper
                            selectedCategories={selectedCategories}
                            onCategoryChange={setSelectedCategories}
                        />
                    </Grid>

                    {state.attachments.length > 0 && (
                        <Grid item xs={12}>
                            <RecipeCreateAttachments
                                onDeleteAttachment={handleDeleteAttachment}
                                onRemoveAttachment={handleRemoveAttachment}
                                onSaveAttachment={handleSaveAttachment}
                                attachments={state.attachments}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} lg={6} xl={4}>
                        <RecipeCreateIngredients
                            amount={state.amount}
                            onDecreaseAmount={() => dispatch({ type: 'decreaseAmount' })}
                            onIncreaseAmount={() => dispatch({ type: 'increaseAmount' })}
                            ingredients={state.ingredients}
                            onIngredientsChange={handleTextFieldChange('ingredients')}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6} xl={4}>
                        <RecipeCreateDescription
                            description={state.description}
                            onDescriptionChange={handleTextFieldChange('description')}
                        />
                    </Grid>

                    {state.relatedRecipes.length > 0 && (
                        <Grid item xs={12} lg={6} xl={4}>
                            <RecipeCard
                                variant="preview"
                                header={<Subtitle icon={<LabelIcon />} text="Passt gut zu" />}
                                content={
                                    <RecipeResultRelated relatedRecipes={state.relatedRecipes} />
                                }
                            />
                        </Grid>
                    )}
                </Grid>
            )}

            <RecipeCreateRelatedDialog
                defaultValues={state.relatedRecipes}
                currentRecipeName={state.name}
                open={state.relatedRecipesDialog}
                onSave={relatedRecipes =>
                    dispatch({ type: 'relatedRecipesChange', relatedRecipes })
                }
                onClose={() => dispatch({ type: 'closeRelatedRecipesDialog' })}
            />

            <Prompt
                when={warnOnLocationChange()}
                message="Nicht gespeicherte Änderungen gehen verloren. Trotzdem die Seite verlassen?"
            />

            <RecipeCreateSpeedDial
                dropzoneProps={dropzoneProps}
                onRelated={() => dispatch({ type: 'openRelatedRecipesDialog' })}
                onPreview={() => dispatch({ type: 'previewChange' })}
                onSave={handleSaveRecipe}
            />
        </>
    )
}

export default RecipeCreate
