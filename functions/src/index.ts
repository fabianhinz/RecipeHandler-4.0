import * as algoliasearch from 'algoliasearch'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const ALGOLIA_ID = functions.config().algolia.app
const ALGOLIA_ADMIN_KEY = functions.config().algolia.adminkey
const RECIPE_PATH = 'recipes/{recipeId}'

const ALGOLIA_INDEX_NAME = 'recipes'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

const serviceAccount = require('../recipehandler-service-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipehandler.firebaseio.com',
})

const editorsCollection = admin.firestore().collection('editors')
const auth = admin.auth()

interface Recipe {
    description: string
    ingredients: string
    name: string
}

export const addToAlgolia = functions
    .region('europe-west1')
    .firestore.document(RECIPE_PATH)
    .onCreate(snapshot => {
        const { description, ingredients, name } = snapshot.data() as Recipe
        const objectID = snapshot.id
        return index.addObject({ description, ingredients, name, objectID })
    })

export const updateAlgolia = functions
    .region('europe-west1')
    .firestore.document(RECIPE_PATH)
    .onUpdate(change => {
        const { description, ingredients, name } = change.after.data() as Recipe
        const objectID = change.after.id
        return index.saveObject({ description, ingredients, name, objectID })
    })

export const deleteFromAlgolia = functions
    .region('europe-west1')
    .firestore.document(RECIPE_PATH)
    .onDelete(snapshot => index.deleteObject(snapshot.id))

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
    .onCreate((_change, context) => {
        admin
            .firestore()
            .collection('recipes')
            .doc(context.params.recipeName)
            .update({ numberOfComments: admin.firestore.FieldValue.increment(1) })
    })

export const handleNumberOfCommentsTrials = functions
    .region('europe-west1')
    .firestore.document('trials/{trialId}/comments/{commentId}')
    .onCreate((_change, context) => {
        admin
            .firestore()
            .collection('trials')
            .doc(context.params.trialId)
            .update({ numberOfComments: admin.firestore.FieldValue.increment(1) })
    })

export const handleChangelog = functions.region('europe-west1').https.onRequest((req, res) => {
    console.log(req.body)
    res.end()
})
