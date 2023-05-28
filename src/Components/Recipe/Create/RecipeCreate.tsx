import LabelIcon from '@mui/icons-material/Label'
import { Breakpoint, Grid, GridSize } from '@mui/material'
import { Timestamp } from 'firebase/firestore'
import { useCallback, useEffect } from 'react'
import { RouteComponentProps, useRouteMatch } from 'react-router'

import CategorySelection from '@/Components/Category/CategorySelection'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { useRouterContext } from '@/Components/Provider/RouterProvider'
import { PATHS } from '@/Components/Routes/Routes'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import StyledCard from '@/Components/Shared/StyledCard'
import TrialsSelection from '@/Components/Trials/TrialsSelection'
import { useCategorySelect } from '@/hooks/useCategorySelect'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { Recipe } from '@/model/model'
import { getRecipeService } from '@/services/recipeService'

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

const fromPropsOrPreviousState = ({ recipe }: Props) =>
  recipe ?? getRecipeService().recipeCreateState

const RecipeCreate = (props: Props) => {
  const { state, dispatch } = useRecipeCreateReducer(
    fromPropsOrPreviousState(props)
  )

  const recipeCreateService = useRecipeCreate(state, props.edit)
  const {
    selectedCategories,
    setSelectedCategories,
    removeSelectedCategories,
  } = useCategorySelect(fromPropsOrPreviousState(props))
  const { user } = useFirebaseAuthContext()
  const { history } = useRouterContext()
  const { gridBreakpointProps: breakpointsFromContext, gridLayout } =
    useGridContext()

  const match = useRouteMatch()

  useDocumentTitle(props.recipe ? props.recipe.name : 'Rezept erstellen')

  useEffect(() => {
    if (match.path === PATHS.recipeEdit()) {
      return
    }

    getRecipeService().recipeCreateState = state
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

  const relatedAwareBreakpoints: Partial<
    Record<Breakpoint, boolean | GridSize>
  > =
    gridLayout === 'list' || state.relatedRecipes.length > 0
      ? breakpointsFromContext
      : { xs: 12, md: 6 }

  return (
    <>
      {state.preview && user ? (
        <RecipeResult
          recipe={{
            name: state.name,
            createdDate: Timestamp.fromDate(new Date()),
            numberOfComments: state.numberOfComments,
            numberOfAttachments: state.numberOfAttachments,
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
              {/* TODO may wanna replace with firebase ml impl 
                            <Grid item xs={12} sm={6} md="auto">
                                <TesseractSelection
                                    description={state.description}
                                    ingredients={state.ingredients}
                                    onChange={result =>
                                        dispatch({ type: 'tesseractResultChange', result })
                                    }
                                />
                            </Grid> */}
              <Grid item xs={12} sm={6} md="auto">
                <TrialsSelection
                  selectedTrial={state.selectedTrial}
                  onSelectedTrialChange={selectedTrial =>
                    dispatch({ type: 'selectedTrialChange', selectedTrial })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md="auto">
                <CategorySelection
                  label="Kategorien"
                  legend="Ein Rezept hat mindestens eine Kategorie"
                  selectedCategories={selectedCategories}
                  onRemoveSelectedCategories={removeSelectedCategories}
                  onCategoryChange={setSelectedCategories}
                />
              </Grid>
              <Grid item xs={12} sm={6} md="auto">
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

      <RecipeCreateSpeedDial
        isPreview={state.preview}
        onPreviewClick={handlePreviewChange}
        onSaveClick={handleSaveRecipe}
      />
    </>
  )
}

export default RecipeCreate
