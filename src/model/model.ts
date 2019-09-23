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
    created: string;
    categories: Categories<string>;
    attachements: Array<T>;
    ingredients: string;
    description: string;
}

export type CategoryType = string;
export interface Categories<T> {
    [type: string]: T;
}

export interface Category {
    [value: string]: string;
}

export type RouteWithRecipeName = RouteComponentProps<{ name: string }>
