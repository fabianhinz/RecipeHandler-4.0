import { PaletteType } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'

export interface Attachment {
    name: string
    size: number
}

export interface AttachmentData extends Attachment {
    dataUrl: string
}

export interface AttachmentMetadata extends Attachment {
    fullPath: string
}

export interface CommentsDocument {
    name: string
    numberOfComments: number
}

export interface Recipe<T extends Attachment> extends CommentsDocument {
    createdDate: firebase.firestore.Timestamp
    categories: Categories<string>
    attachments: Array<T>
    ingredients: string
    amount: number
    description: string
    editor: Editor
    relatedRecipes: Array<string>
}

export type CategoryType = string
export interface Categories<T> {
    [type: string]: T
}

export interface Category {
    [value: string]: string
}

export type RouteWithRecipeName = RouteComponentProps<{ name: string }>

export type RecipeDocument = Recipe<AttachmentMetadata>

export interface Comment {
    createdDate: firebase.firestore.Timestamp
    documentId: string
    comment: string
    dislikes: number
    likes: number
}

export interface Trial extends CommentsDocument {
    fullPath: string
    createdDate: firebase.firestore.Timestamp
}

export interface CommentsCollections {
    collection: 'recipes' | 'trials'
}

export type Hit = Pick<RecipeDocument, 'name' | 'description' | 'ingredients'> & {
    _highlightResult: {
        name: { value: string }
        description: { value: string }
        ingredients: { value: string }
    }
}

export type Hits = Array<Hit>

export type DataUrl = string

export type DocumentId = string

export type Editor = {
    uid: string
    username: string
    muiTheme: PaletteType
    showAllRecipes: boolean
    admin?: boolean
}
