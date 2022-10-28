import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/analytics'

import firebase from 'firebase/app'

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

firebase.initializeApp(firebaseConfig)
if (import.meta.env.PROD) {
  firebase.firestore().enablePersistence({ synchronizeTabs: true })
}

const functions = firebase.app().functions('europe-west1')
const firestore = firebase.firestore()
const storage = firebase.storage()
const storageRef = storage.ref()
const auth = firebase.auth()
let analytics: firebase.analytics.Analytics | undefined

if (import.meta.env.PROD) {
  analytics = firebase.analytics()
}

if (USE_EMULATORS) {
  functions.useEmulator('localhost', 5001)
  firestore.useEmulator('localhost', 8080)
  storage.useEmulator('localhost', 9199)
}

const createTimestampFromDate = (date: Date) => firebase.firestore.Timestamp.fromDate(date)
const createDateFromTimestamp = (timestamp: firebase.firestore.Timestamp) =>
  new firebase.firestore.Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
const incrementBy = (value: number) => firebase.firestore.FieldValue.increment(value)
const deleteField = firebase.firestore.FieldValue.delete

export const FirebaseService = {
  firestore,
  storage,
  storageRef,
  auth,
  analytics,
  createTimestampFromDate,
  createDateFromTimestamp,
  incrementBy,
  functions,
  deleteField,
  QUERY_LIMIT: 12,
  QUERY_LIMIT_MOBILE: 6,
}
