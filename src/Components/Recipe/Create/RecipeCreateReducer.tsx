import { Reducer, useReducer } from 'react'

import { Categories, Recipe } from '../../../model/model'

export interface RecipeCreateState {
    name: string
    editorUid?: string
    categories: Categories<string>
    ingredients: string
    amount: number
    description: string
    preview: boolean
    storageDeleteRefs: Array<firebase.storage.Reference>
    numberOfComments: number
    relatedRecipes: Array<string>
    relatedRecipesDialog: boolean
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
    | { type: 'storageDeleteRefsChange'; ref: firebase.storage.Reference }
    | { type: 'relatedRecipesChange'; relatedRecipes: Array<string> }
    | { type: 'openRelatedRecipesDialog' }
    | { type: 'closeRelatedRecipesDialog' }

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
                amount: state.amount < 20 ? ++state.amount : state.amount,
            }
        }
        case 'decreaseAmount': {
            return { ...state, amount: state.amount === 1 ? state.amount : --state.amount }
        }
        case 'storageDeleteRefsChange': {
            return {
                ...state,
                storageDeleteRefs: [...state.storageDeleteRefs, action.ref],
            }
        }
        case 'relatedRecipesChange': {
            return { ...state, relatedRecipes: action.relatedRecipes, relatedRecipesDialog: false }
        }
        case 'openRelatedRecipesDialog': {
            return { ...state, relatedRecipesDialog: true }
        }
        case 'closeRelatedRecipesDialog': {
            return { ...state, relatedRecipesDialog: false }
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
    storageDeleteRefs: [],
    numberOfComments: 0,
    relatedRecipes: [],
    relatedRecipesDialog: false,
}

export const useRecipeCreateReducer = (recipe?: Recipe | null) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, ...recipe })
    return { state, dispatch }
}

export type RecipeCreateDispatch = { dispatch: React.Dispatch<Action> }
