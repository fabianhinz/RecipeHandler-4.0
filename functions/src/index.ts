import algoliasearch from 'algoliasearch'
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
    previewAttachment?: string
}

export const addToAlgolia = functions
    .region('europe-west1')
    .firestore.document(RECIPE_PATH)
    .onCreate(snapshot => {
        const { description, ingredients, name } = snapshot.data() as Recipe
        const objectID = snapshot.id
        return index.saveObject({ description, ingredients, name, objectID })
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

export const handleCommentNotification = functions
    .region('europe-west1')
    .firestore.document('recipes/{recipeName}/comments/{commentId}')
    .onCreate(async (change, context) => {
        const commentData = change.data()

        // ? get a snapshot of all users that have a FCMRegistrationToken
        const snapshot = await admin
            .firestore()
            .collection('users')
            .orderBy('FCMRegistrationToken')
            .get()

        // ? get all registration tokens, except the one of the editor who created the comment
        const tokens = snapshot.docs
            .map(doc => {
                if (doc.id === commentData.editorUid) return false
                else return doc.data().FCMRegistrationToken
            })
            .filter(Boolean)

        if (tokens.length === 0) {
            console.log('FCMRegistrationToken array is empty')
            return
        }

        const editorSnapshot = await admin.firestore().doc(`/users/${commentData.editorUid}`).get()

        try {
            // ? send the notification to all clients
            const batchResponse = await admin.messaging().sendMulticast({
                data: {
                    type: 'comment',
                    recipeName: context.params.recipeName,
                    comment: commentData.comment,
                    // ? the document will exist - the commentData returns the uid of the edtior
                    creator: editorSnapshot.data()?.username,
                },
                tokens,
            })
            console.log('batchResponse: ', JSON.stringify(batchResponse))
        } catch (e) {
            console.error(JSON.stringify(e))
        }

        return
    })

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

export const handleNumberOfAttachmentsRecipeIncrease = functions
    .region('europe-west1')
    .firestore.document('/recipes/{recipeName}/attachments/{docId}')
    .onCreate((_change, context) =>
        admin
            .firestore()
            .collection('recipes')
            .doc(context.params.recipeName)
            .update({ numberOfAttachments: admin.firestore.FieldValue.increment(1) })
    )

export const handleNumberOfAttachmentsRecipeDecrease = functions
    .region('europe-west1')
    .firestore.document('/recipes/{recipeName}/attachments/{docId}')
    .onDelete((_change, context) =>
        admin
            .firestore()
            .collection('recipes')
            .doc(context.params.recipeName)
            .update({ numberOfAttachments: admin.firestore.FieldValue.increment(-1) })
    )

interface Label {
    name: string
    color: string
}

export const handleChangelog = functions.region('europe-west1').https.onRequest((req, res) => {
    if (req.body.pull_request) {
        const { action, pull_request } = req.body
        const { merge_commit_sha, merged, title, body, closed_at, user } = pull_request
        if (action === 'closed' && merged && user.login !== 'dependabot[bot]') {
            const shortSha = merge_commit_sha ? merge_commit_sha.slice(0, 7) : ''
            // TODO evtl nur Nummer mit Hash davor suchen und hash vor speichern wieder entfernen?
            const issueNumbers = body.match(/\d+/g)
            admin
                .firestore()
                .collection('pullrequests')
                .doc(shortSha)
                .set({
                    shortSha,
                    title,
                    issueNumbers,
                    closedAt: admin.firestore.Timestamp.fromDate(new Date(closed_at)),
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
            filePath.includes('_400x400') ||
            filePath.includes('_500x500')
        )
            return

        const fileExtension = path.extname(filePath)
        const filePathWithoutExtension = filePath.replace(fileExtension, '')

        const mediumFilePath = `${filePathWithoutExtension}_1000x1000${fileExtension}`
        const smallFilePath = `${filePathWithoutExtension}_500x500${fileExtension}`
        const smallFilePathFallback = `${filePathWithoutExtension}_400x400${fileExtension}`

        // ? lets delete the images generated by the generateResizedImage extension
        const bucket = admin.storage().bucket(objectMetadata.bucket)

        try {
            await bucket.file(mediumFilePath).delete()
            try {
                await bucket.file(smallFilePath).delete()
            } catch (err) {
                await bucket.file(smallFilePathFallback).delete()
            }
        } catch (err) {
            console.warn('Error deleting files', err)
        }

        console.log('deleted', mediumFilePath, smallFilePath, smallFilePathFallback)
        return
    })

export const handleRecipesCounter = functions
    .region('europe-west1')
    .pubsub.schedule('every 24 hours')
    .onRun(async () => {
        const firestore = admin.firestore()
        const recipesCounter = new Map<string, { value: number }>()

        const usersSnapshot = await firestore.collection('users').get()

        for (const userDoc of usersSnapshot.docs) {
            const recipesSnapshot = await firestore
                .collection('recipes')
                .where('editorUid', '==', userDoc.id)
                .get()
            recipesCounter.set(userDoc.id, { value: recipesSnapshot.docs.length })
        }

        for (const [userUid, value] of recipesCounter) {
            await firestore.collection('recipesCounter').doc(userUid).set(value)
        }

        return
    })

export const handleRecipeAttachmentVibrants = functions
    .region('europe-west1')
    .firestore.document('/recipes/{recipeName}')
    .onWrite(async (snapshot, context) => {
        if (!snapshot.after.exists) return

        const { previewAttachment, name } = snapshot.after.data() as Recipe
        if (!previewAttachment) return

        const Vibrant = await import('node-vibrant')
        const swatches = await Vibrant.from(previewAttachment).getSwatches()
        const previewAttachmentSwatches = {
            vibrant: swatches.Vibrant?.hex,
            muted: swatches.Muted?.hex,
            darkVibrant: swatches.DarkVibrant?.hex,
            darkMuted: swatches.DarkMuted?.hex,
            lightVibrant: swatches.LightVibrant?.hex,
            lightMuted: swatches.LightMuted?.hex,
        }

        console.log(`swatches extracted from ${name}`, previewAttachmentSwatches)

        return admin.firestore().collection('recipes').doc(context.params.recipeName).update({
            previewAttachmentSwatches,
        })
    })
