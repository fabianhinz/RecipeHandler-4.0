import { Analytics, getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDfKo9psV6Err683fvtIkdkXX8A-Gep1zs',
  authDomain: 'recipehandler.firebaseapp.com',
  databaseURL: 'https://recipehandler.firebaseio.com',
  projectId: 'recipehandler',
  storageBucket: 'recipehandler.appspot.com',
  messagingSenderId: '363099897269',
  appId: '1:363099897269:web:7086b238a86f56c9546dfc',
  measurementId: 'G-H654Z1725E',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)
export let analytics: Analytics | undefined

functions.region = 'europe-west1'

if (import.meta.env.PROD) {
  analytics = getAnalytics(app)
  void enableMultiTabIndexedDbPersistence(firestore)
}

if (import.meta.env.RECIPE_HANDLER_USE_EMULATORS) {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(firestore, 'localhost', 8080)
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectStorageEmulator(storage, 'localhost', 9199)
}
