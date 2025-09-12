import { Analytics, getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore'
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

import { User } from '@/model/model'

const firebaseConfig = {
  apiKey: "AIzaSyDWSTHdnCu7R-wjkWFN9VHlt2lt0qMPwyA",
  databaseURL: 'https://octo-recipes.firebaseio.com',
  authDomain: "octo-recipes.firebaseapp.com",
  projectId: "octo-recipes",
  storageBucket: "octo-recipes.firebasestorage.app",
  messagingSenderId: "366315770438",
  appId: "1:366315770438:web:6547106fc8855285fdf047"
};

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

export const getCustomToken = httpsCallable<User['uid'], string>(
  functions,
  'getCustomToken'
)
