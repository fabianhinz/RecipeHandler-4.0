import * as algoliasearch from 'algoliasearch'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as path from 'path'

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

        const editorsCollection = admin.firestore().collection('editors')
        const editorSnapshot = await editorsCollection.doc(context.auth.uid).get()

        if (!editorSnapshot.exists) {
            throw new functions.https.HttpsError('permission-denied', 'nicht autorisiert')
        }

        try {
            const auth = admin.auth()
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
    .onCreate((_change, context) =>
        admin
            .firestore()
            .collection('recipes')
            .doc(context.params.recipeName)
            .update({ numberOfComments: admin.firestore.FieldValue.increment(1) })
    )

export const handleNumberOfCommentsTrials = functions
    .region('europe-west1')
    .firestore.document('trials/{trialId}/comments/{commentId}')
    .onCreate((_change, context) =>
        admin
            .firestore()
            .collection('trials')
            .doc(context.params.trialId)
            .update({ numberOfComments: admin.firestore.FieldValue.increment(1) })
    )

interface Label {
    name: string
    color: string
}

export const handleChangelog = functions.region('europe-west1').https.onRequest((req, res) => {
    if (req.body.pull_request) {
        const { action, pull_request } = req.body
        const { merge_commit_sha, merged, title, body, closed_at, user } = pull_request
        if (action === 'closed' && merged) {
            const shortSha = merge_commit_sha ? merge_commit_sha.slice(0, 7) : ''
            const issueNumbers = body.match(/\d+/g)
            admin
                .firestore()
                .collection('pullrequests')
                .doc(shortSha)
                .set({
                    shortSha,
                    title,
                    issueNumbers,
                    closedAt: closed_at,
                    creator: user.login,
                })
        }
    }
    if (req.body.issue) {
        const { action, issue } = req.body
        if (action === 'closed') {
            const { number, title, body, labels } = issue
            const labelNames: Array<string> = labels.map((label: Label) => {
                return { name: label.name, color: label.color }
            })
            admin
                .firestore()
                .collection('issues')
                .doc(`${number}`)
                .set({ number, title, subject: body, labels: labelNames })
        }
    }
    res.end()
})

export const onRemoveImageDeleteResizedOnes = functions
    .region('europe-west1')
    .storage.object()
    .onDelete(async objectMetadata => {
        const { contentType, name: filePath } = objectMetadata

        if (
            !filePath ||
            !contentType ||
            !contentType.startsWith('image/') ||
            filePath.includes('_1000x1000') ||
            filePath.includes('_400x400')
        )
            return

        const fileExtension = path.extname(filePath)
        const filePathWithoutExtension = filePath.replace(fileExtension, '')

        const mediumFilePath = `${filePathWithoutExtension}_1000x1000${fileExtension}`
        const smallFilePath = `${filePathWithoutExtension}_400x400${fileExtension}`

        // ? lets delete the images generated by the generateResizedImage extension
        const bucket = admin.storage().bucket(objectMetadata.bucket)

        try {
            await bucket.file(mediumFilePath).delete()
            await bucket.file(smallFilePath).delete()
        } catch (err) {
            console.warn('Error deleting files', err)
        }

        console.log('deleted', mediumFilePath, smallFilePath)
        return
    })
