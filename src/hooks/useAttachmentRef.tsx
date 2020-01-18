import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import { AttachmentData, AttachmentMetadata } from '../model/model'
import { isMetadata } from '../model/modelUtil'
import { FirebaseService } from '../services/firebase'

export interface DataUrls {
    fullDataUrl: string
    mediumDataUrl: string
    smallDataUrl: string
}

interface State extends DataUrls {
    base: Omit<AttachmentData, 'dataUrl'>
}

const initialDataUrls = { fullDataUrl: '', mediumDataUrl: '', smallDataUrl: '' }

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

export const getResizedImages = async (fullPath: string) => {
    const { smallPath, mediumPath } = getRefPaths(fullPath)
    const urls: Omit<State, 'base'> = { ...initialDataUrls }

    try {
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
    const [attachmentRef, setAttachmentRef] = useState<State>({
        base: {
            name: attachment && attachment.name,
            size: attachment && attachment.size,
        },
        ...initialDataUrls,
    })
    const [attachmentRefLoading, setAttachmentRefLoading] = useState(true)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        let mounted = true
        if (!isMetadata(attachment)) return setAttachmentRefLoading(false)

        getResizedImages(attachment.fullPath).then(urls => {
            if (!mounted) return
            setAttachmentRef(previous => ({ ...previous, ...urls }))
            setAttachmentRefLoading(false)
        })

        return () => {
            mounted = false
        }
    }, [attachment, enqueueSnackbar])

    return { attachmentRef, attachmentRefLoading }
}
