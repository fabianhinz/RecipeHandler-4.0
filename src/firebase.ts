import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDfKo9psV6Err683fvtIkdkXX8A-Gep1zs",
    authDomain: "recipehandler.firebaseapp.com",
    databaseURL: "https://recipehandler.firebaseio.com",
    projectId: "recipehandler",
    storageBucket: "recipehandler.appspot.com",
    messagingSenderId: "363099897269",
    appId: "1:363099897269:web:7086b238a86f56c9546dfc"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence({ synchronizeTabs: true });

const firestore = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();
const auth = firebase.auth();

const createTimestampFrom = (date: Date) => firebase.firestore.Timestamp.fromDate(date);
const incrementBy = (value: number) => firebase.firestore.FieldValue.increment(value);
const decreaseBy = (value: number) => firebase.firestore.FieldValue.increment(value);

export const FirebaseService = {
    firestore,
    storage,
    storageRef,
    auth,
    createTimestampFrom,
    incrementBy,
    decreaseBy
};
