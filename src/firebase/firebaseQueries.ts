import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  limit,
  orderBy,
  query,
  where,
  WithFieldValue,
} from 'firebase/firestore'

import { Recipe } from '@/model/model'

import { firestore } from './firebaseConfig'
import {
  RecipesRootCollection,
  SupportedCollectionPath,
  TrialsRootCollection,
} from './firebaseModel'

export const queryLimits = {
  desktop: 12,
  mobile: 6,
}
type PathOrRef = SupportedCollectionPath | CollectionReference

export const resolveCollection = (pathOrRef: PathOrRef) => {
  if (pathOrRef instanceof CollectionReference) {
    return collection(firestore, pathOrRef.path)
  }

  return collection(firestore, pathOrRef)
}

const getDocPath = (path: string, id?: string) => (id ? `${path}/${id}` : path)
export const resolveDoc = (pathOrRef: PathOrRef, id?: string) => {
  if (pathOrRef instanceof CollectionReference) {
    return doc(firestore, getDocPath(pathOrRef.path, id))
  }

  return doc(firestore, getDocPath(pathOrRef, id))
}

export const addDocTo = <Data extends WithFieldValue<Record<string, unknown>>>(
  path: PathOrRef,
  data: Data
) => {
  return addDoc(resolveCollection(path), data)
}

export const resolveCookingHistoryOrderedByDateDesc = (userId: string) => {
  const now = new Date()
  now.setDate(now.getDate() - 365 / 4)
  const lastQuarter = new Date(now)

  return query(
    resolveCollection(`users/${userId}/cookingHistory`),
    where('createdDate', '>=', lastQuarter),
    orderBy('createdDate', 'desc')
  )
}

export const resolvePullRequestsOrderedByClosedAtDesc = () => {
  return query(
    resolveCollection('pullrequests'),
    orderBy('closedAt', 'desc'),
    limit(20)
  )
}

export const resolveAttachmentsOrderedByCreatedDateAsc = (
  recipeName: Recipe['name']
) => {
  return query(
    resolveCollection(`recipes/${recipeName}/attachments`),
    orderBy('createdDate', 'asc')
  )
}

export const resolveCommentsOrderedByCreatedDateAsc = (
  collection: TrialsRootCollection | RecipesRootCollection,
  recipeName: Recipe['name']
) => {
  return query(
    resolveCollection(`${collection}/${recipeName}/comments`),
    orderBy('createdDate', 'asc')
  )
}

export const resolveArchivedExpensesOrderedByDateDesc = (userId: string) => {
  return query(
    resolveCollection(`users/${userId}/archivedExpenses`),
    orderBy('date', 'desc')
  )
}

export const resolveCookCounterOrderedByValueDesc = (
  matchingDocuments: number
) => {
  return query(
    resolveCollection(`cookCounter`),
    limit(matchingDocuments),
    orderBy('value', 'desc')
  )
}
