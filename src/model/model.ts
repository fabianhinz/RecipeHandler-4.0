import { PaletteType } from '@material-ui/core'
import { firestore } from 'firebase'
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

export interface Trial extends Editor, CommentsDocument {
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

export type Hits = ReadonlyArray<Hit>

export type DocumentId = string

export type User = {
    uid: string
    username: string
    muiTheme: PaletteType | 'dynamic' | 'black'
    selectedUsers: string[]
    showRecentlyAdded: boolean
    showMostCooked: boolean
    notifications: boolean
    admin?: boolean
    profilePicture?: string
    emailVerified: boolean
    createdDate: firebase.firestore.Timestamp
    algoliaAdvancedSyntax: boolean
    bookmarkSync: boolean
    bookmarks: string[]
}

export interface Pullrequest {
    closedAt: firestore.Timestamp
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

export type TesseractText = string

export type TesseractPart = keyof Pick<Recipe, 'ingredients' | 'description'> | undefined

export type TesseractResult = { text: TesseractText; tesseractPart: TesseractPart }

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
