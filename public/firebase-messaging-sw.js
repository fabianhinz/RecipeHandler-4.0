/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyDfKo9psV6Err683fvtIkdkXX8A-Gep1zs',
    authDomain: 'recipehandler.firebaseapp.com',
    databaseURL: 'https://recipehandler.firebaseio.com',
    projectId: 'recipehandler',
    storageBucket: 'recipehandler.appspot.com',
    messagingSenderId: '363099897269',
    appId: '1:363099897269:web:7086b238a86f56c9546dfc',
    measurementId: 'G-XR1E22ZPY4',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)

    if (payload.data.type === 'comment') {
        const { recipeName, comment, creator } = payload.data
        self.registration.showNotification(recipeName, {
            body: `${creator}: ${comment}`,
            icon: '/logo512.png',
        })
    }
})
