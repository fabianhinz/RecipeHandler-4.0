import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where,
  WithFieldValue,
} from 'firebase/firestore'

import { OrderByKey, OrderByRecord, Recipe, Trial, User } from '@/model/model'

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
export const resolveDoc = (
  pathOrRef: PathOrRef,
  id?: string,
  delegateId?: boolean
) => {
  if (!id && delegateId) {
    return doc(
      collection(
        firestore,
        pathOrRef instanceof CollectionReference ? pathOrRef.path : pathOrRef
      )
    )
  }

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

export const resolveArchivedExpensesOrderedByDateDesc = (
  userId: User['uid']
) => {
  return query(
    resolveCollection(`users/${userId}/archivedExpenses`),
    orderBy('date', 'desc')
  )
}

export const resolveCookCounterOrderedByValueDesc = (
  maxNumberOfDocs: number
) => {
  return query(
    resolveCollection('cookCounter'),
    limit(maxNumberOfDocs),
    orderBy('value', 'desc')
  )
}

export const resolveCookCounterOrderedByCreatedDateDescWhereValueIsZero =
  () => {
    return query(
      resolveCollection('cookCounter'),
      orderBy('createdDate', 'desc'),
      where('value', '==', '0')
    )
  }

export const resolveExpensesOrderedByDateDesc = (userId: User['uid']) => {
  return query(
    resolveCollection(`users/${userId}/expenses`),
    orderBy('date', 'desc')
  )
}

export const resolveUsersOrderedByNameAsc = () => {
  return query(resolveCollection('users'), orderBy('username', 'asc'))
}

export const resolveNRecipeAttachmentsOrderedByCreatedDateAsc = (
  recipeName: Recipe['name'],
  maxNumberOfDocs = 5
) => {
  return query(
    resolveCollection(`recipes/${recipeName}/attachments`),
    orderBy('createdDate', 'desc'),
    limit(maxNumberOfDocs)
  )
}

export const resolveTrialsOrderedByCreatedDateDesc = (
  startAfterTrial?: Trial
) => {
  const constraints: QueryConstraint[] = [
    orderBy('createdDate', 'desc'),
    limit(queryLimits.desktop),
  ]

  if (startAfterTrial) {
    constraints.push(startAfter(startAfterTrial.createdDate))
  }

  return query(resolveCollection('trials'), ...constraints)
}

interface RecipesConstraintValues {
  orderByRecord: OrderByRecord
  selectedCategories: Map<string, string>
  lastRecipe?: Recipe
  selectedEditor?: User['uid']
}
export const resolveRecipesByConstraintValues = ({
  orderByRecord,
  lastRecipe,
  selectedCategories,
  selectedEditor,
}: RecipesConstraintValues) => {
  const orderByKey = Object.keys(orderByRecord)[0] as OrderByKey
  const constraints: QueryConstraint[] = [
    limit(queryLimits.desktop),
    orderBy(orderByKey, orderByRecord[orderByKey]),
  ]

  if (selectedEditor) {
    constraints.push(where('editorUid', '==', selectedEditor))
  }

  if (lastRecipe) {
    constraints.push(startAfter(lastRecipe[orderByKey]))
  }

  for (const [type, value] of selectedCategories) {
    constraints.push(where(`categories.${type}`, '==', value))
  }

  return query(resolveCollection('recipes'), ...constraints)
}

const endAt = (search: string) => {
  // https://stackoverflow.com/a/57290806
  return search.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))
}

export const resolveRelatedRecipes = (search?: string) => {
  const constraints: QueryConstraint[] = [limit(queryLimits.desktop * 2)]

  if (search) {
    constraints.push(
      orderBy('name', 'asc'),
      where('name', '>=', search),
      where('name', '<', endAt(search))
    )
  } else {
    constraints.push(orderBy('createdDate', 'desc'))
  }

  return query(resolveCollection('recipes'), ...constraints)
}
