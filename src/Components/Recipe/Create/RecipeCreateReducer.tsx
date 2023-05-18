import { Reducer, useReducer } from 'react'

import { Categories, Recipe, TesseractResult, Trial } from '@/model/model'

export interface RecipeCreateState {
  name: string
  editorUid?: string
  categories: Categories<string>
  ingredients: string
  amount: number
  description: string
  preview: boolean
  numberOfComments: number
  numberOfAttachments: number
  relatedRecipes: Array<string>
  selectedTrial?: Trial
}

export type CreateChangeKey = keyof Pick<
  RecipeCreateState,
  'ingredients' | 'description' | 'name'
>
export type AttachmentName = { old: string; new: string }

type Action =
  | { type: 'loadState'; recipe: Recipe }
  | {
      type: 'textFieldChange'
      key: CreateChangeKey
      value: string
    }
  | { type: 'previewChange' }
  | { type: 'categoriesChange'; selectedCategories: Map<string, string> }
  | { type: 'increaseAmount' }
  | { type: 'decreaseAmount' }
  | { type: 'relatedRecipesChange'; relatedRecipes: Array<string> }
  | { type: 'selectedTrialChange'; selectedTrial?: Trial }
  | { type: 'tesseractResultChange'; result: TesseractResult }

const reducer: Reducer<RecipeCreateState, Action> = (state, action) => {
  switch (action.type) {
    case 'loadState': {
      return { ...state, ...action.recipe }
    }
    case 'textFieldChange':
      return { ...state, [action.key]: action.value }
    case 'previewChange':
      return { ...state, preview: !state.preview }
    case 'categoriesChange': {
      const categories: Categories<string> = {}
      action.selectedCategories.forEach((value, type) => {
        categories[type] = value
      })
      return { ...state, categories }
    }
    case 'increaseAmount': {
      return {
        ...state,
        amount: state.amount < 20 ? ++state.amount : state.amount,
      }
    }
    case 'decreaseAmount': {
      return {
        ...state,
        amount: state.amount === 1 ? state.amount : --state.amount,
      }
    }
    case 'relatedRecipesChange': {
      return {
        ...state,
        relatedRecipes: action.relatedRecipes,
        relatedRecipesDialog: false,
      }
    }
    case 'selectedTrialChange': {
      return { ...state, selectedTrial: action.selectedTrial }
    }
    case 'tesseractResultChange': {
      const { text, tesseractPart: key } = action.result

      if (state[key].includes(text)) {
        return { ...state, [key]: state[key].replace(text, '') }
      } else {
        return { ...state, [key]: state[key] + text }
      }
    }
  }
}

const initialState: RecipeCreateState = {
  name: '',
  categories: {},
  ingredients: '',
  amount: 1,
  description: '',
  preview: false,
  numberOfComments: 0,
  numberOfAttachments: 0,
  relatedRecipes: [],
}

export const useRecipeCreateReducer = (
  recipe?: RecipeCreateState | Recipe | null
) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...recipe })
  return { state, dispatch }
}

export type RecipeCreateDispatch = { dispatch: React.Dispatch<Action> }
