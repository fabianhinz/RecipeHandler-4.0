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
    categories: RecipeCategories;
    attachements: Array<T>;
    ingredients: string;
    description: string;
}

export interface RecipeCategories {
    [key: string]: boolean;
}
