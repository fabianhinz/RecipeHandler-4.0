import { RouteComponentProps } from "react-router";

export interface Attachement {
    name: string;
    size: number;
}

export interface AttachementData extends Attachement {
    dataUrl: string;
}

export interface AttachementMetadata extends Attachement {
    fullPath: string;
}

export interface Recipe<T extends Attachement> {
    name: string;
    createdDate: firebase.firestore.Timestamp;
    categories: Categories<string>;
    attachements: Array<T>;
    ingredients: string;
    amount: number;
    description: string;
    numberOfComments: number;
    relatedRecipes: Array<string>;
}

export type CategoryType = string;
export interface Categories<T> {
    [type: string]: T;
}

export interface Category {
    [value: string]: string;
}

export type RouteWithRecipeName = RouteComponentProps<{ name: string }>;

export type RecipeDocument = Recipe<AttachementMetadata>;

export interface Comment {
    createdDate: firebase.firestore.Timestamp;
    documentId: string;
    comment: string;
    dislikes: number;
    likes: number;
}
