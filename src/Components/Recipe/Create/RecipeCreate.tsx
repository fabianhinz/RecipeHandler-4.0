import { Grid, GridSize } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import LabelIcon from '@material-ui/icons/Label'
import React, { useCallback, useEffect } from 'react'
import { RouteComponentProps, useRouteMatch } from 'react-router'

import { useCategorySelect } from '../../../hooks/useCategorySelect'
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import { Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import recipeService from '../../../services/recipeService'
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

interface Props extends Pick<RouteComponentProps, 'history' | 'location'> {
    recipe?: Recipe | null
    edit?: boolean
}

const fromPropsOrPreviousState = ({ recipe }: Props) => recipe || recipeService.recipeCreateState

const RecipeCreate = (props: Props) => {
    const { state, dispatch } = useRecipeCreateReducer(fromPropsOrPreviousState(props))

    const recipeCreateService = useRecipeCreate(state, props.edit)
    const {
        selectedCategories,
        setSelectedCategories,
        removeSelectedCategories,
    } = useCategorySelect(fromPropsOrPreviousState(props))
    const { user } = useFirebaseAuthContext()
    const { history } = useRouterContext()
    const { gridBreakpointProps: breakpointsFromContext } = useGridContext()

    const match = useRouteMatch()

    useDocumentTitle(props.recipe ? props.recipe.name : 'Rezept erstellen')

    useEffect(() => {
        if (match.path === PATHS.recipeEdit()) return
        recipeService.recipeCreateState = state
    }, [match.path, state])

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

    const relatedAwareBreakpoints: Partial<Record<Breakpoint, boolean | GridSize>> =
        state.relatedRecipes.length > 0 ? breakpointsFromContext : { xs: 12, md: 6 }

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
                        quantity: state.quantity,
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
                                <TesseractSelection
                                    description={state.description}
                                    ingredients={state.ingredients}
                                    onChange={result =>
                                        dispatch({ type: 'tesseractResultChange', result })
                                    }
                                />
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
                                    label="Kategorien auswählen"
                                    selectedCategories={selectedCategories}
                                    onRemoveSelectedCategories={removeSelectedCategories}
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
                            <Grid item {...relatedAwareBreakpoints}>
                                <RecipeCreateIngredients
                                    amount={state.amount}
                                    quantity={state.quantity}
                                    ingredients={state.ingredients}
                                    dispatch={dispatch}
                                    onIngredientsChange={handleTextFieldChange('ingredients')}
                                />
                            </Grid>

                            <Grid item {...relatedAwareBreakpoints}>
                                <RecipeCreateDescription
                                    description={state.description}
                                    onDescriptionChange={handleTextFieldChange('description')}
                                />
                            </Grid>

                            {state.relatedRecipes.length > 0 && (
                                <Grid item {...relatedAwareBreakpoints}>
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

            <RecipeCreateSpeedDial onPreview={handlePreviewChange} onSave={handleSaveRecipe} />
        </>
    )
}

export default RecipeCreate
