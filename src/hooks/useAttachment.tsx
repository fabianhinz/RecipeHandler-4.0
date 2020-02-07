import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import { AllDataUrls, AttachmentDoc, Metadata } from '../model/model'
import { FirebaseService } from '../services/firebase'

const initialDataUrlsAndMetadata = {
    fullDataUrl: '',
    mediumDataUrl: '',
    smallDataUrl: '',
    timeCreated: '',
    size: '',
}

export const getFileExtension = (fullpath: string) => fullpath.split('.').slice(-1)[0]

const getRefPaths = (fullPath: string) => {
    // ? the fullPath Field in firestore always looks something like [whatever].jpg|png
    const extension = getFileExtension(fullPath)
    const basePath = fullPath.replace(`.${extension}`, '')

    return {
        mediumPath: `${basePath}_1000x1000.${extension}`,
        smallPath: `${basePath}_400x400.${extension}`,
    }
}

export const getResizedImagesWithMetadata = async (fullPath: string) => {
    const { smallPath, mediumPath } = getRefPaths(fullPath)
    const urlsAndMetadata: AllDataUrls & Metadata = { ...initialDataUrlsAndMetadata }

    try {
        const { storage } = FirebaseService

        const metadata = await storage.ref(fullPath).getMetadata()
        urlsAndMetadata.timeCreated = new Date(metadata.timeCreated).toLocaleDateString()
        urlsAndMetadata.size = `${(metadata.size / 1000).toFixed(0)} KB`

        urlsAndMetadata.fullDataUrl = await storage.ref(fullPath).getDownloadURL()
        urlsAndMetadata.mediumDataUrl = await storage.ref(mediumPath).getDownloadURL()
        urlsAndMetadata.smallDataUrl = await storage.ref(smallPath).getDownloadURL()
    } catch (e) {
        // ? happens after creating an attachment. just load the full version
        urlsAndMetadata.mediumDataUrl = urlsAndMetadata.fullDataUrl
        urlsAndMetadata.smallDataUrl = urlsAndMetadata.fullDataUrl
    }

    return urlsAndMetadata
}

export const useAttachment = (doc?: AttachmentDoc) => {
    const [attachmentRef, setAttachmentRef] = useState({
        ...doc,
        ...initialDataUrlsAndMetadata,
    })
    const [attachmentRefLoading, setAttachmentRefLoading] = useState(true)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (!doc) return
        let mounted = true

        getResizedImagesWithMetadata(doc.fullPath).then(urlsAndMetadata => {
            if (!mounted) return
            setAttachmentRef(previous => ({ ...previous, ...urlsAndMetadata }))
            setAttachmentRefLoading(false)
        })

        return () => {
            mounted = false
        }
    }, [doc, enqueueSnackbar])

    return { attachmentRef, attachmentRefLoading }
}
