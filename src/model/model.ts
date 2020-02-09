import { PaletteType } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'

export interface Editor {
    editorUid: string
}

export interface DataUrl {
    dataUrl: string
}

export interface CreatedDate {
    createdDate: firebase.firestore.Timestamp
}

export interface AttachmentDoc extends Editor, CreatedDate, Partial<FirestoreDocPath> {
    name: string
    size: number
    fullPath: string
}

export interface CommentsDocument {
    name: string
    numberOfComments: number
}

export interface Recipe extends CommentsDocument, Editor, CreatedDate {
    categories: Categories<string>
    ingredients: string
    amount: number
    description: string
    relatedRecipes: Array<string>
    previewAttachment?: string
}

export type CategoryType = string
export interface Categories<T> {
    [type: string]: T
}

export interface Category {
    [value: string]: string
}

export type RouteWithRecipeName = RouteComponentProps<{ name: string }>

export interface Comment extends Editor {
    createdDate: firebase.firestore.Timestamp
    documentId: string
    comment: string
}

export interface CommentReaction extends Editor, CreatedDate {
    emoji: string
}

export interface Trial extends CommentsDocument {
    editorUid: string
    fullPath: string
    createdDate: firebase.firestore.Timestamp
}

export interface CommentsCollections {
    collection: 'recipes' | 'trials'
}

export type Hit = Pick<Recipe, 'name' | 'description' | 'ingredients'> & {
    _highlightResult: {
        name: { value: string }
        description: { value: string }
        ingredients: { value: string }
    }
}

export type Hits = Array<Hit>

export type DocumentId = string

export type User = {
    uid: string
    username: string
    muiTheme: PaletteType | 'dynamic'
    selectedUsers: string[]
    showRecentlyAdded: boolean
    showMostCooked: boolean
    notifications: boolean
    admin?: boolean
    profilePicture?: string
    emailVerified?: boolean
    createdDate: firebase.firestore.Timestamp
    algoliaAdvancedSyntax: boolean
    bookmarkSync: boolean
    bookmarks: string[]
}

export type RecipeName = string
export type Grocery = string

export type ShoppingList = Map<RecipeName, { list: Grocery[] } | undefined>
export type ShoppingTracker = Map<RecipeName, { tracker: Grocery[] } | undefined>

export type OrderByKey = keyof Pick<Recipe, 'name' | 'createdDate'>
export type OrderByRecord = Partial<Record<OrderByKey, 'asc' | 'desc'>>

export interface AllDataUrls {
    fullDataUrl: string
    mediumDataUrl: string
    smallDataUrl: string
}

export interface Metadata {
    timeCreated: string
    size: string
}

export interface FirestoreDocPath {
    docPath: string
}

export interface MostCooked<T> {
    value: T
}
