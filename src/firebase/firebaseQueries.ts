import { addDoc, collection, doc, WithFieldValue } from 'firebase/firestore'

import { firestore } from './firebaseConfig'

export const queryLimits = { desktop: 12, mobile: 6 }

export const appCollections = [
  'admins',
  'categories',
  'cookCounter',
  'editors',
  'errors',
  'rating',
  'recipes',
  'recipesCounter',
  'trials',
  'users',
] as const

export type AppCollection = typeof appCollections[number]

export const getCollection = (appCollection: AppCollection) => {
  return collection(firestore, appCollection)
}

export const getUserDoc = (id: string) => {
  return doc(firestore, `users/${id}`)
}

export const addDocTo = <T extends WithFieldValue<Record<string, unknown>>>(
  appCollection: AppCollection,
  data: T
) => {
  return addDoc(getCollection(appCollection), data)
}
