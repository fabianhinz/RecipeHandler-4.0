import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const serviceAccount = require('../recipehandler-service-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipehandler.firebaseio.com',
})

const editorsCollection = admin.firestore().collection('editors')
// const recipesCollection = admin.firestore().collection('recipes')
// const storage = admin.storage()

interface AttachementData {
    name: string
    size: number
    dataUrl: string
}

interface Data {
    attachments: AttachementData[]
}

export const uploadAttachments = functions
    .region('europe-west1')
    .https.onCall(async (data: Data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'nicht authentifiziert')
        }

        const editorSnapshot = await editorsCollection.doc(context.auth.uid).get()
        if (!editorSnapshot.exists) {
            throw new functions.https.HttpsError('permission-denied', 'nicht autorisiert')
        }

        return { attachments: data.attachments }
    })
