import { DocumentData, DocumentReference } from 'firebase/firestore'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'

export const useSafeShoppingListRef = (): DocumentReference<DocumentData> => {
  const authContext = useFirebaseAuthContext()

  if (!authContext.unsafeShoppingListRef.current) {
    throw new Error('shoppinglist document reference could not be resolved')
  }

  return authContext.unsafeShoppingListRef.current
}
