import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import { AttachementData, AttachementMetadata } from '../model/model'
import { isMetadata } from '../model/modelUtil'
import { FirebaseService } from '../services/firebase'

interface State {
    base: Omit<AttachementData, 'dataUrl'>
    fullDataUrl: string
    mediumDataUrl: string
    smallDataUrl: string
}

const initialDataUrls = { fullDataUrl: '', mediumDataUrl: '', smallDataUrl: '' }

export const getFileExtension = (fullpath: string) => fullpath.split('.').slice(-1)[0]

export const getRefPaths = (fullPath: string) => {
    // ? the fullPath Field in firestore always looks something like [whatever].jpg|png
    const extension = getFileExtension(fullPath)
    const basePath = fullPath.replace(`.${extension}`, '')

    return {
        mediumPath: `${basePath}_1000x1000.${extension}`,
        smallPath: `${basePath}_400x400.${extension}`,
    }
}

const getResizedImages = async (fullPath: string) => {
    const { smallPath, mediumPath } = getRefPaths(fullPath)
    const urls: Omit<State, 'base'> = { ...initialDataUrls }

    try {
        urls.fullDataUrl = await FirebaseService.storage.ref(fullPath).getDownloadURL()
        urls.mediumDataUrl = await FirebaseService.storage.ref(mediumPath).getDownloadURL()
        urls.smallDataUrl = await FirebaseService.storage.ref(smallPath).getDownloadURL()
    } catch (e) {
        // ? happens after creating an attachement. catch it and move on....
    }

    return urls
}

export const useAttachementRef = (attachement: AttachementMetadata | AttachementData) => {
    const [attachementRef, setAttachementRef] = useState<State>({
        base: {
            name: attachement && attachement.name,
            size: attachement && attachement.size,
        },
        ...initialDataUrls,
    })
    const [attachementRefLoading, setAttachementRefLoading] = useState(true)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        let mounted = true
        if (!isMetadata(attachement)) return setAttachementRefLoading(false)

        getResizedImages(attachement.fullPath).then(urls => {
            if (!mounted) return
            setAttachementRef(previous => ({ ...previous, ...urls }))
            setAttachementRefLoading(false)
        })

        return () => {
            mounted = false
        }
    }, [attachement, enqueueSnackbar])

    return { attachementRef, attachementRefLoading }
}
