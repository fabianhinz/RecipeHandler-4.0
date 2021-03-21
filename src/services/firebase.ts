import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/performance'
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
    measurementId: 'G-XR1E22ZPY4',
}

firebase.initializeApp(firebaseConfig)
firebase.firestore().enablePersistence({ synchronizeTabs: true })
const functions = firebase.app().functions('europe-west1')

if (process.env.NODE_ENV !== 'production') functions.useFunctionsEmulator('http://localhost:5000')

const firestore = firebase.firestore()
const storage = firebase.storage()
const storageRef = storage.ref()
const auth = firebase.auth()
const performance = firebase.performance()

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
    createTimestampFromDate,
    createDateFromTimestamp,
    incrementBy,
    performance,
    functions,
    deleteField,
    QUERY_LIMIT: 12,
    QUERY_LIMIT_MOBILE: 6,
}
