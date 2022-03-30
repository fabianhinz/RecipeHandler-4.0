import { PaletteType } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'

export interface Editor {
    editorUid: string
}

export interface DataUrl {
    dataUrl: string
}

export interface CreatedDate {
    createdDate: firebase.default.firestore.Timestamp
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
    previewAttachmentSwatches?: {
        vibrant?: string
        muted?: string
        darkVibrant?: string
        darkMuted?: string
        lightVibrant?: string
        lightMuted?: string
    }
    numberOfAttachments: number
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
    createdDate: firebase.default.firestore.Timestamp
    documentId: string
    comment: string
}

export interface CommentReaction extends Editor, CreatedDate {
    emoji: string
}

export interface Trial extends Editor, CommentsDocument {
    fullPath: string
    createdDate: firebase.default.firestore.Timestamp
}

export interface CommentsCollections {
    collection: 'recipes' | 'trials'
}

type AlgoliaSnippetResult = {
    matchLevel: string
    value: string
}

type AlgoliaHighlightResult = AlgoliaSnippetResult & { matchedWords: string[] }

export type Hit = Pick<Recipe, 'name' | 'description' | 'ingredients'> & {
    _highlightResult: {
        name: AlgoliaHighlightResult
        description: AlgoliaHighlightResult
        ingredients: AlgoliaHighlightResult
    }
    _snippetResult: {
        description: AlgoliaSnippetResult
        ingredients: AlgoliaSnippetResult
    }
}

export type DocumentId = string

export type User = {
    uid: string
    username: string
    muiTheme: PaletteType | 'dynamic' | 'black'
    selectedUsers: string[]
    showRecentlyEdited: boolean
    showMostCooked: boolean
    showNew: boolean
    notifications: boolean
    admin?: boolean
    profilePicture?: string
    emailVerified: boolean
    createdDate: firebase.default.firestore.Timestamp
    algoliaAdvancedSyntax: boolean
    bookmarkSync: boolean
    bookmarks: string[]
}

export interface Pullrequest {
    closedAt: firebase.default.firestore.Timestamp
    creator: string
    issueNumbers: string[] | undefined
    shortSha: string
    title: string
}

export interface Label {
    name: string
    color: string
}

export interface Issue {
    labels: Label[]
    number: number
    subject: string
    title: string
}
export type RecipeName = string

export type OrderByKey = keyof Pick<Recipe, 'name' | 'createdDate'>
export type OrderByRecord = Partial<Record<OrderByKey, 'asc' | 'desc'>>

export interface AllDataUrls {
    fullDataUrl: string | undefined
    mediumDataUrl: string | undefined
    smallDataUrl: string | undefined
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
    createdDate: firebase.default.firestore.Timestamp
}

export type TesseractResult = {
    text: string
    tesseractPart: keyof Pick<Recipe, 'ingredients' | 'description'>
}

export interface TesseractLog {
    workerId?: string
    status:
        | 'loading tesseract core'
        | 'initializing tesseract'
        | 'initialized tesseract'
        | 'loading language traineddata'
        | 'loaded language traineddata'
        | 'initializing api'
        | 'initialized api'
        | 'recognizing text'
    progress?: number
}

export interface CookingHistory {
    createdDate: firebase.default.firestore.Timestamp
    recipeName: string
}

export interface ShoppingListItem {
    recipeNameRef?: string
    value: string
    checked: boolean
}

export type Expense = {
    id?: string
    creator: string
    amount: number
    shop: string
    category: string
    description?: string
    date: firebase.default.firestore.Timestamp
    relatedUsers: string[]
    // TODO fix me
    [key: string]: any
}

export type ArchivedExpense = Expense & { deletedAt: firebase.default.firestore.Timestamp }

export type Nullable<UnderlyingType> = null | UnderlyingType
