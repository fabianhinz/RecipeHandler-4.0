import { Grid } from '@material-ui/core'
import LabelIcon from '@material-ui/icons/Label'
import React, { FC, useCallback, useEffect } from 'react'
import { Prompt, RouteComponentProps } from 'react-router'

import { useCategorySelect } from '../../../hooks/useCategorySelect'
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import { Recipe, TesseractResult } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import CategorySelection from '../../Category/CategorySelection'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useGridContext } from '../../Provider/GridProvider'
import { useRouterContext } from '../../Provider/RouterProvider'
import { PATHS } from '../../Routes/Routes'
import EntryGridContainer from '../../Shared/EntryGridContainer'
import StyledCard from '../../Shared/StyledCard'
import TesseractSelection from '../../Tesseract/TesseractSelection'
import TrialsSelection from '../../Trials/TrialsSelection'
import RelatedRecipesSelection from '../RelatedRecipesSelection'
import RecipeResult from '../Result/RecipeResult'
import { RecipeResultRelated } from '../Result/RecipeResultRelated'
import RecipeCreateDescription from './RecipeCreateDescription'
import RecipeCreateHeader from './RecipeCreateHeader'
import RecipeCreateIngredients from './RecipeCreateIngredients'
import { CreateChangeKey, useRecipeCreateReducer } from './RecipeCreateReducer'
import RecipeCreateSpeedDial from './RecipeCreateSpeedDial'
import { useRecipeCreate } from './useRecipeCreate'

interface RecipeCreateProps extends Pick<RouteComponentProps, 'history' | 'location'> {
    recipe?: Recipe | null
    edit?: boolean
}

const RecipeCreate: FC<RecipeCreateProps> = props => {
    const { state, dispatch } = useRecipeCreateReducer(props.recipe)

    const recipeCreateService = useRecipeCreate(state, props.edit)
    const { selectedCategories, setSelectedCategories } = useCategorySelect(props.recipe)
    const { user } = useFirebaseAuthContext()
    const { history } = useRouterContext()
    const { gridBreakpointProps } = useGridContext()

    useDocumentTitle(props.recipe ? props.recipe.name : 'Rezept erstellen')

    useEffect(() => {
        dispatch({ type: 'categoriesChange', selectedCategories })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategories])

    useEffect(() => {
        if (!user) history.push(PATHS.home)
    }, [history, user])

    const handleSaveRecipe = useCallback(async () => {
        const valid = await recipeCreateService.validate(selectedCategories)
        if (!valid) return

        await recipeCreateService.saveRecipeDocument()
    }, [recipeCreateService, selectedCategories])

    const handleTextFieldChange = (key: CreateChangeKey) => (value: string) => {
        dispatch({ type: 'textFieldChange', key, value })
    }

    const handlePreviewChange = async () => {
        const valid = await recipeCreateService.validate(selectedCategories)
        if (valid) dispatch({ type: 'previewChange' })
    }

    const warnOnLocationChange = () => {
        if (props.recipe && !recipeCreateService.changesSaved) {
            return true
        } else if (
            (state.name.length > 0 ||
                Object.keys(state.categories).length > 0 ||
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

    const handleTesseractSave = (results: TesseractResult[]) => {
        results.forEach(result => dispatch({ type: 'tesseractResultSave', result }))
    }

    return (
        <>
            {state.preview && user ? (
                <RecipeResult
                    recipe={{
                        name: state.name,
                        createdDate: FirebaseService.createTimestampFromDate(new Date()),
                        numberOfComments: 0,
                        categories: state.categories,
                        ingredients: state.ingredients,
                        amount: state.amount,
                        description: state.description,
                        relatedRecipes: state.relatedRecipes,
                        editorUid: user.uid,
                    }}
                />
            ) : (
                <EntryGridContainer>
                    <Grid item xs={12}>
                        <RecipeCreateHeader
                            inputDisabled={props.edit}
                            name={state.name}
                            onNameChange={handleTextFieldChange('name')}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm="auto">
                                <TesseractSelection onSave={handleTesseractSave} />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <TrialsSelection
                                    selectedTrial={state.selectedTrial}
                                    onSelectedTrialChange={selectedTrial =>
                                        dispatch({ type: 'selectedTrialChange', selectedTrial })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <CategorySelection
                                    label="Kategorien"
                                    selectedCategories={selectedCategories}
                                    onCategoryChange={setSelectedCategories}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto">
                                <RelatedRecipesSelection
                                    relatedRecipes={state.relatedRecipes}
                                    onRelatedRecipesChange={relatedRecipes =>
                                        dispatch({ type: 'relatedRecipesChange', relatedRecipes })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item {...gridBreakpointProps}>
                                <RecipeCreateIngredients
                                    amount={state.amount}
                                    ingredients={state.ingredients}
                                    dispatch={dispatch}
                                    onIngredientsChange={handleTextFieldChange('ingredients')}
                                />
                            </Grid>

                            <Grid item {...gridBreakpointProps}>
                                <RecipeCreateDescription
                                    description={state.description}
                                    onDescriptionChange={handleTextFieldChange('description')}
                                />
                            </Grid>

                            {state.relatedRecipes.length > 0 && (
                                <Grid item {...gridBreakpointProps}>
                                    <StyledCard header="Passt gut zu" BackgroundIcon={LabelIcon}>
                                        <RecipeResultRelated
                                            relatedRecipes={state.relatedRecipes}
                                        />
                                    </StyledCard>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </EntryGridContainer>
            )}

            <Prompt
                when={warnOnLocationChange()}
                message="Nicht gespeicherte Änderungen gehen verloren. Trotzdem die Seite verlassen?"
            />

            <RecipeCreateSpeedDial onPreview={handlePreviewChange} onSave={handleSaveRecipe} />
        </>
    )
}

export default RecipeCreate
