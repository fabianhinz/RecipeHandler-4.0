import { Reducer, useReducer } from 'react'

import { Categories, Quantity, Recipe, TesseractResult, Trial } from '../../../model/model'

export interface RecipeCreateState {
    name: string
    editorUid?: string
    categories: Categories<string>
    ingredients: string
    amount?: number
    quantity: Quantity
    description: string
    preview: boolean
    numberOfComments: number
    relatedRecipes: Array<string>
    selectedTrial?: Trial
}

export type CreateChangeKey = keyof Pick<RecipeCreateState, 'ingredients' | 'description' | 'name'>
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
    | {
          type: 'quantityChange'
          quantity: Quantity
      }
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
            let categories: Categories<string> = {}
            action.selectedCategories.forEach((value, type) => {
                categories[type] = value
            })
            return { ...state, categories }
        }
        case 'increaseAmount': {
            return {
                ...state,
                quantity:
                    state.quantity.value < 20
                        ? { ...state.quantity, value: ++state.quantity.value }
                        : state.quantity,
            }
        }
        case 'decreaseAmount': {
            return {
                ...state,
                quantity:
                    state.quantity.value === 1
                        ? state.quantity
                        : { ...state.quantity, value: --state.quantity.value },
            }
        }
        case 'quantityChange': {
            return { ...state, quantity: action.quantity }
        }
        case 'relatedRecipesChange': {
            return { ...state, relatedRecipes: action.relatedRecipes, relatedRecipesDialog: false }
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
    quantity: {
        type: 'persons',
        value: 1,
    },
    description: '',
    preview: false,
    numberOfComments: 0,
    relatedRecipes: [],
}

export const useRecipeCreateReducer = (recipe?: RecipeCreateState | Recipe | null) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, ...recipe })
    return { state, dispatch }
}

export type RecipeCreateDispatch = { dispatch: React.Dispatch<Action> }
