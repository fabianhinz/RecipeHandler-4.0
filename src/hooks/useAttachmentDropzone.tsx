import { Alert } from '@mui/material';
import compressImage from 'browser-image-compression'
import { Timestamp } from 'firebase/firestore'
import { useCallback, useState } from 'react'
import { DropzoneState, FileRejection, useDropzone } from 'react-dropzone'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { AttachmentDoc, DataUrl } from '@/model/model'

export const readDocumentAsync = (document: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(document)
  })

export type DropzoneProps = Record<
  'dropzoneProps',
  Pick<DropzoneState, 'getInputProps' | 'getRootProps'>
>

interface Options {
  attachmentLimit: number
  attachmentMaxSize?: number
  attachmentMaxWidth?: number
}

export const useAttachmentDropzone = ({
  attachmentLimit,
  attachmentMaxWidth,
  attachmentMaxSize,
}: Options) => {
  const [attachments, setAttachments] = useState<
    Array<AttachmentDoc & DataUrl>
  >([])
  const [attachmentAlert, setAttachmentAlert] = useState<
    JSX.Element | undefined
  >()

  const { user } = useFirebaseAuthContext()

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const closeAlert = () => setAttachmentAlert(undefined)

      if (!user)
        return setAttachmentAlert(
          <Alert severity="error" onClose={closeAlert}>
            Fehlende Berechtigungen
          </Alert>
        )

      if (rejectedFiles.length > 0)
        return setAttachmentAlert(
          <Alert severity="error" onClose={closeAlert}>
            Lediglich JPG, PNG sind möglich
          </Alert>
        )

      if (acceptedFiles.length > attachmentLimit)
        return setAttachmentAlert(
          <Alert severity="warning" onClose={closeAlert}>
            Maximal zulässige Anzahl an Bildern überschritten
          </Alert>
        )

      setAttachmentAlert(
        <Alert severity="info">Dateien werden komprimiert</Alert>
      )

      const newAttachments: Array<AttachmentDoc & DataUrl> = []
      for (const file of acceptedFiles) {
        let compressedFile: Blob | null = null
        if (attachmentMaxSize || attachmentMaxWidth) {
          compressedFile = await compressImage(file, {
            maxSizeMB: attachmentMaxSize || 1,
            maxWidthOrHeight: attachmentMaxWidth || 3840,
          })
        }

        const dataUrl: string = await readDocumentAsync(compressedFile || file)
        newAttachments.push({
          name: file.name,
          dataUrl,
          fullPath: '',
          size: compressedFile?.size || file.size,
          editorUid: user ? user.uid : 'unkown',
          createdDate: Timestamp.fromDate(new Date()),
        })
      }
      setAttachments(newAttachments)
      closeAlert()
    },
    [attachmentLimit, attachmentMaxSize, attachmentMaxWidth, user]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    noDrag: true,
  })

  return {
    dropzoneProps: { getRootProps, getInputProps },
    dropzoneAttachments: attachments,
    dropzoneAlert: attachmentAlert,
  }
}
