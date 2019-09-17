import { CategoriesAs } from "../components/category/Categories";

export const MOCK_TIME_CATEGORIES = [
    "~20 Minuten",
    "~30 Minuten",
    "~40 Minuten",
    "> 50 Minuten"
];

export const MOCK_CATEGORIES = ["Salat", "Fleisch", "vegetarisch"];

export interface Attachement {
    name: string;
    size: number;
}

export interface AttachementData extends Attachement {
    dataUrl: string;
}

export const isData = (attachement: AttachementData | AttachementMetadata): attachement is AttachementData =>
    (attachement as AttachementData).dataUrl !== undefined;

export interface AttachementMetadata extends Attachement {
    fullPath: string;
}

export const isMetadata = (attachement: AttachementData | AttachementMetadata): attachement is AttachementMetadata =>
    (attachement as AttachementMetadata).fullPath !== undefined;

export interface Recipe<T extends Attachement> {
    name: string;
    created: string;
    categories: CategoriesAs<Array<string>>;
    attachements: Array<T>;
    ingredients: string;
    description: string;
}
