import { getDownloadURL, getMetadata, ref } from 'firebase/storage'
import { useLayoutEffect, useState } from 'react'

import { storage } from '@/firebase/firebaseConfig'
import { AllDataUrls, AttachmentDoc, Metadata } from '@/model/model'

const initialDataUrlsAndMetadata: AllDataUrls & Metadata = {
  fullDataUrl: undefined,
  mediumDataUrl: undefined,
  smallDataUrl: undefined,
  timeCreated: '',
  size: '',
}

export const getFileExtension = (fullpath: string) =>
  fullpath.split('.').slice(-1)[0]

const getAttachmentRefs = (fullPath: string) => {
  // ? the fullPath Field in firestore always looks something like [whatever].jpg|png
  const extension = getFileExtension(fullPath)
  const basePath = fullPath.replace(`.${extension}`, '')

  return {
    mediumPath: `${basePath}_1000x1000.${extension}`,
    smallPath: `${basePath}_500x500.${extension}`,
    smallPathFallback: `${basePath}_400x400.${extension}`,
  }
}

export const getResizedImagesWithMetadata = async (fullPath: string) => {
  const attachmentRefs = getAttachmentRefs(fullPath)
  const data: AllDataUrls & Metadata = {
    ...initialDataUrlsAndMetadata,
  }

  const settledRequests = await Promise.allSettled([
    getMetadata(ref(storage, fullPath)),
    getDownloadURL(ref(storage, fullPath)),
    getDownloadURL(ref(storage, attachmentRefs.mediumPath)),
    getDownloadURL(ref(storage, attachmentRefs.smallPath)),
    getDownloadURL(ref(storage, attachmentRefs.smallPathFallback)),
  ])

  const [
    metadata,
    fullDataUrl,
    mediumDataUrl,
    smallDataUrl,
    smallDataUrlFallback,
  ] = settledRequests

  if (
    metadata.status !== 'fulfilled' ||
    fullDataUrl.status !== 'fulfilled' ||
    mediumDataUrl.status !== 'fulfilled'
  ) {
    if (fullDataUrl.status === 'rejected') {
      throw new Error(
        `could not load dataurl for image with fullPath: '${fullPath}'`
      )
    }

    // ? happens after creating an attachment. just load the full version
    data.smallDataUrl = fullDataUrl.value
    data.mediumDataUrl = fullDataUrl.value
    data.fullDataUrl = fullDataUrl.value

    return data
  }

  data.timeCreated = new Date(metadata.value.timeCreated).toLocaleDateString()
  data.size = `${(metadata.value.size / 1000).toFixed(0)} KB`

  data.fullDataUrl = fullDataUrl.value
  data.mediumDataUrl = mediumDataUrl.value

  if (smallDataUrl.status === 'fulfilled') {
    data.smallDataUrl = smallDataUrl.value
  } else if (smallDataUrlFallback.status === 'fulfilled') {
    data.smallDataUrl = smallDataUrlFallback.value
  }

  return data
}

export const useAttachment = (doc?: AttachmentDoc) => {
  const [attachmentRef, setAttachmentRef] = useState({
    ...doc,
    ...initialDataUrlsAndMetadata,
  })
  const [attachmentRefLoading, setAttachmentRefLoading] = useState(true)

  useLayoutEffect(() => {
    if (!doc) {
      setAttachmentRef({ ...initialDataUrlsAndMetadata })
      setAttachmentRefLoading(false)
      return
    } else {
      setAttachmentRefLoading(true)
    }

    let mounted = true

    void getResizedImagesWithMetadata(doc.fullPath).then(urlsAndMetadata => {
      if (!mounted) return
      setAttachmentRef(previous => ({ ...previous, ...urlsAndMetadata }))
      setAttachmentRefLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [doc])

  return { attachmentRef, attachmentRefLoading }
}
