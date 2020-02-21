import { Alert } from '@material-ui/lab'
import compressImage from 'browser-image-compression'
import React, { useCallback, useState } from 'react'
import { DropzoneState, useDropzone } from 'react-dropzone'

import { useFirebaseAuthContext } from '../Components/Provider/FirebaseAuthProvider'
import { AttachmentDoc, DataUrl } from '../model/model'
import { FirebaseService } from '../services/firebase'

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
    attachmentMaxWidth: number
}

export const useAttachmentDropzone = ({ attachmentLimit, attachmentMaxWidth }: Options) => {
    const [attachments, setAttachments] = useState<Array<AttachmentDoc & DataUrl>>([])
    const [attachmentAlert, setAttachmentAlert] = useState<JSX.Element | undefined>()

    const { user } = useFirebaseAuthContext()

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: File[]) => {
            const closeAlert = () => setAttachmentAlert(undefined)

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

            setAttachmentAlert(<Alert severity="info">Dateien werden komprimiert</Alert>)

            const newAttachments: Array<AttachmentDoc & DataUrl> = []
            for (const file of acceptedFiles) {
                const compressedFile: Blob = await compressImage(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: attachmentMaxWidth,
                })
                const dataUrl: string = await readDocumentAsync(compressedFile)
                newAttachments.push({
                    name: file.name,
                    dataUrl,
                    fullPath: '',
                    size: file.size,
                    editorUid: user ? user.uid : 'unkown',
                    createdDate: FirebaseService.createTimestampFromDate(new Date()),
                })
            }
            setAttachments(newAttachments)
            closeAlert()
        },
        [attachmentLimit, attachmentMaxWidth, user]
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
