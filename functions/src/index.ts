import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const serviceAccount = require('../recipehandler-service-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipehandler.firebaseio.com',
})

const editorsCollection = admin.firestore().collection('editors')
const auth = admin.auth()

export const getCustomToken = functions
    .region('europe-west1')
    .https.onCall(async (_data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'nicht authentifiziert')
        }

        const editorSnapshot = await editorsCollection.doc(context.auth.uid).get()
        if (!editorSnapshot.exists) {
            throw new functions.https.HttpsError('permission-denied', 'nicht autorisiert')
        }

        try {
            const customToken = await auth.createCustomToken(editorSnapshot.id, { isEditor: true })
            return customToken
        } catch (e) {
            throw new functions.https.HttpsError(
                'internal',
                'custom token konnte nicht erstellt werden'
            )
        }
    })

export const handleNumberOfCommentsRecipes = functions
    .region('europe-west1')
    .firestore.document('recipes/{recipeName}/comments/{commentId}')
    .onWrite((change, context) => {
        admin
            .firestore()
            .collection('recipes')
            .doc(context.params.recipeName)
            .update({ numberOfComments: admin.firestore.FieldValue.increment(1) })
    })

export const handleNumberOfCommentsTrials = functions
    .region('europe-west1')
    .firestore.document('trials/{trialId}/comments/{commentId}')
    .onWrite((change, context) => {
        admin
            .firestore()
            .collection('trials')
            .doc(context.params.trialId)
            .update({ numberOfComments: admin.firestore.FieldValue.increment(1) })
    })
