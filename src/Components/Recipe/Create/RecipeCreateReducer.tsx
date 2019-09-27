import { useReducer, Reducer } from "react";
import { AttachementData, AttachementMetadata, Recipe, Categories } from "../../../model/model";

interface State {
    name: string;
    categories: Categories<string>;
    attachements: Array<AttachementData | AttachementMetadata>;
    ingredients: string;
    amount: number;
    description: string;
    preview: boolean;
    attachementsUploading: boolean;
    recipeUploading: boolean;
    storageDeleteRefs: Array<firebase.storage.Reference>;
    numberOfComments: number;
    relatedRecipes: Array<string>;
    relatedRecipesDialog: boolean;
}

export type CreateChangeKey = keyof Pick<State, "ingredients" | "description" | "name">;
export type AttachementName = { old: string; new: string };

type Action =
    | { type: "loadState"; recipe: Recipe<AttachementMetadata> }
    | {
          type: "textFieldChange";
          key: CreateChangeKey;
          value: string;
      }
    | { type: "previewChange" }
    | { type: "attachementsUploadingChange"; now: boolean }
    | { type: "recipeUploadingChange"; now: boolean }
    | { type: "attachementsDrop"; newAttachements: Array<AttachementData | AttachementMetadata> }
    | { type: "removeAttachement"; name: string }
    | { type: "categoriesChange"; selectedCategories: Map<string, string> }
    | { type: "attachementNameChange"; name: AttachementName }
    | { type: "increaseAmount" }
    | { type: "decreaseAmount" }
    | { type: "storageDeleteRefsChange"; ref: firebase.storage.Reference }
    | { type: "relatedRecipesChange"; relatedRecipes: Array<string> }
    | { type: "openRelatedRecipesDialog" };

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "loadState": {
            return { ...state, ...action.recipe };
        }
        case "textFieldChange":
            return { ...state, [action.key]: action.value };
        case "previewChange":
            return { ...state, preview: !state.preview };
        case "attachementsUploadingChange":
            return { ...state, attachementsUploading: action.now };
        case "recipeUploadingChange":
            return { ...state, recipeUploading: action.now };
        case "attachementsDrop":
            return { ...state, attachements: [...state.attachements, ...action.newAttachements] };
        case "removeAttachement":
            return {
                ...state,
                attachements: state.attachements.filter(
                    attachement => attachement.name !== action.name
                )
            };
        case "categoriesChange":
            let categories: Categories<string> = {};
            action.selectedCategories.forEach((value, type) => {
                categories[type] = value;
            });
            return { ...state, categories };
        case "attachementNameChange": {
            const { name } = action;
            state.attachements.forEach(attachement => {
                if (attachement.name === name.old) attachement.name = name.new;
            });
            return { ...state };
        }
        case "increaseAmount": {
            return {
                ...state,
                amount: state.amount < 20 ? ++state.amount : state.amount
            };
        }
        case "decreaseAmount": {
            return { ...state, amount: state.amount === 1 ? state.amount : --state.amount };
        }
        case "storageDeleteRefsChange": {
            return {
                ...state,
                storageDeleteRefs: [...state.storageDeleteRefs, action.ref]
            };
        }
        case "relatedRecipesChange": {
            return { ...state, relatedRecipes: action.relatedRecipes, relatedRecipesDialog: false };
        }
        case "openRelatedRecipesDialog": {
            return { ...state, relatedRecipesDialog: true };
        }
    }
};

const initialState: State = {
    name: "",
    categories: {},
    attachements: [],
    ingredients: "",
    amount: 1,
    description: "",
    preview: false,
    attachementsUploading: false,
    recipeUploading: false,
    storageDeleteRefs: [],
    numberOfComments: 0,
    relatedRecipes: [],
    relatedRecipesDialog: false
};

export const useRecipeCreateReducer = (recipe?: Recipe<AttachementMetadata> | null) => {
    const [state, dispatch] = useReducer(reducer, { ...initialState, ...recipe });
    return { state, dispatch };
};
