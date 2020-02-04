import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import { AttachmentData, AttachmentMetadata, DataUrls, Metadata } from '../model/model'
import { isMetadata } from '../model/modelUtil'
import { FirebaseService } from '../services/firebase'

interface AttachmentRef extends DataUrls, Metadata {
    base: Omit<AttachmentData, 'dataUrl'>
}

const initialDataUrlsAndMetadata = {
    fullDataUrl: '',
    mediumDataUrl: '',
    smallDataUrl: '',
    timeCreated: '',
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
    const urls: Omit<AttachmentRef, 'base'> = { ...initialDataUrlsAndMetadata }

    try {
        const metadata = await FirebaseService.storage.ref(fullPath).getMetadata()
        urls.timeCreated = new Date(metadata.timeCreated).toLocaleDateString()

        urls.fullDataUrl = await FirebaseService.storage.ref(fullPath).getDownloadURL()
        urls.mediumDataUrl = await FirebaseService.storage.ref(mediumPath).getDownloadURL()
        urls.smallDataUrl = await FirebaseService.storage.ref(smallPath).getDownloadURL()
    } catch (e) {
        // ? happens after creating an attachment. just load the full version
        urls.mediumDataUrl = urls.fullDataUrl
        urls.smallDataUrl = urls.fullDataUrl
    }

    return urls
}

export const useAttachmentRef = (attachment: AttachmentMetadata | AttachmentData) => {
    const [attachmentRef, setAttachmentRef] = useState<AttachmentRef>({
        base: {
            name: attachment && attachment.name,
            size: attachment && attachment.size,
        },
        ...initialDataUrlsAndMetadata,
    })
    const [attachmentRefLoading, setAttachmentRefLoading] = useState(true)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        let mounted = true
        if (!isMetadata(attachment)) return setAttachmentRefLoading(false)

        getResizedImagesWithMetadata(attachment.fullPath).then(urlsAndMetadata => {
            if (!mounted) return
            setAttachmentRef(previous => ({ ...previous, ...urlsAndMetadata }))
            setAttachmentRefLoading(false)
        })

        return () => {
            mounted = false
        }
    }, [attachment, enqueueSnackbar])

    return { attachmentRef, attachmentRefLoading }
}
