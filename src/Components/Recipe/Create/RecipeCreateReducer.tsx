import { Reducer, useReducer } from 'react'

import { AttachmentData, AttachmentMetadata, Categories, Recipe } from '../../../model/model'

export interface RecipeCreateState {
    name: string
    editorUid?: string
    categories: Categories<string>
    attachments: Array<AttachmentData | AttachmentMetadata>
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
    | { type: 'loadState'; recipe: Recipe<AttachmentMetadata> }
    | {
          type: 'textFieldChange'
          key: CreateChangeKey
          value: string
      }
    | { type: 'previewChange' }
    | { type: 'attachmentsDrop'; newAttachments: Array<AttachmentData | AttachmentMetadata> }
    | { type: 'removeAttachment'; name: string }
    | { type: 'categoriesChange'; selectedCategories: Map<string, string> }
    | { type: 'attachmentNameChange'; name: AttachmentName }
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
        case 'attachmentsDrop':
            return { ...state, attachments: [...state.attachments, ...action.newAttachments] }
        case 'removeAttachment':
            return {
                ...state,
                attachments: state.attachments.filter(
                    attachment => attachment.name !== action.name
                ),
            }
        case 'categoriesChange': {
            let categories: Categories<string> = {}
            action.selectedCategories.forEach((value, type) => {
                categories[type] = value
            })
            return { ...state, categories }
        }
        case 'attachmentNameChange': {
            const { name } = action
            state.attachments.forEach(attachment => {
                if (attachment.name === name.old) attachment.name = name.new
            })
            return { ...state }
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
    attachments: [],
    ingredients: '',
    amount: 1,
    description: '',
    preview: false,
    storageDeleteRefs: [],
    numberOfComments: 0,
    relatedRecipes: [],
    relatedRecipesDialog: false,
}

export const useRecipeCreateReducer = (recipe?: Recipe<AttachmentMetadata> | null) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, ...recipe })
    return { state, dispatch }
}
