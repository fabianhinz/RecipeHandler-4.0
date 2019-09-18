export interface CategoryAs<T> {
    type: T;
    time: T;
}

export type CategoryVariants = keyof CategoryAs<Set<string>>;

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
    categories: CategoryAs<Array<string>>;
    attachements: Array<T>;
    ingredients: string;
    description: string;
}
