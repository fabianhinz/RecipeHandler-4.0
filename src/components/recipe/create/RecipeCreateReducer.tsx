import { useReducer, Reducer } from "react";
import { CategoryAs, AttachementData, AttachementMetadata, Recipe } from "../../../model/model";

interface State {
    name: string;
    categories: CategoryAs<Array<string>>;
    attachements: Array<AttachementData | AttachementMetadata>;
    ingredients: string;
    description: string;
    preview: boolean;
    attachementsUploading: boolean;
    recipeUploading: boolean;
}

export type CreateChangeKey = keyof Pick<State, "ingredients" | "description" | "name">;

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
    | { type: "categoryChange"; categories: CategoryAs<Array<string>> };

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
        case "categoryChange":
            return { ...state, categories: action.categories };
    }
};

const initialState: State = {
    name: "",
    categories: { time: [], type: [] },
    attachements: [],
    ingredients: "",
    description: "",
    preview: false,
    attachementsUploading: false,
    recipeUploading: false
};

export const useRecipeCreateReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return { state, dispatch };
};
