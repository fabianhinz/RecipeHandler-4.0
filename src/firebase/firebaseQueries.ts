import {
  addDoc,
  collection,
  doc,
  limit,
  orderBy,
  query,
  where,
  WithFieldValue,
} from 'firebase/firestore'

import { Recipe } from '@/model/model'

import { firestore } from './firebaseConfig'
import { FirestorePath, TrialsSubCollectionResolver } from './firebaseModel'

export const queryLimits = { desktop: 12, mobile: 6 }

export const resolveCollection = (path: TrialsSubCollectionResolver) => {
  return collection(firestore, path)
}

resolveCollection('trials/15720284529061216902729/comments/DHk5EcNTZwJyoErnJj8R/reactions')

export const resolveDoc = (path: FirestorePath, id?: string) => {
  const resolvedPath = id ? `${path}/${id}` : path
  return doc(firestore, resolvedPath)
}

export const addDocTo = <Data extends WithFieldValue<Record<string, unknown>>>(
  path: FirestorePath,
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
  return query(resolveCollection('pullrequests'), orderBy('closedAt', 'desc'), limit(20))
}

export const resolveAttachmentsOrderedByCreatedDateAsc = (recipeName: Recipe['name']) => {
  return query(
    resolveCollection(`recipes/${recipeName}/attachments`),
    orderBy('createdDate', 'asc')
  )
}
