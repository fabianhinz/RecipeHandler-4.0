import { Alert } from '@material-ui/lab'
import compressImage from 'browser-image-compression'
import React, { useCallback, useState } from 'react'
import { DropzoneState, useDropzone } from 'react-dropzone'

import { AttachmentData, AttachmentMetadata } from '../../../../model/model'
import { useFirebaseAuthContext } from '../../../Provider/FirebaseAuthProvider'

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
    currentAttachments?: Array<AttachmentData | AttachmentMetadata>
    attachmentLimit: number
    attachmentMaxWidth: number
}

export const useAttachmentDropzone = ({
    currentAttachments,
    attachmentLimit,
    attachmentMaxWidth,
}: Options) => {
    const [attachments, setAttachments] = useState<Array<AttachmentData>>([])
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

            const newAttachments: Array<AttachmentData> = []
            const uniqueNames = new Set(
                currentAttachments ? currentAttachments.map(({ name }) => name) : []
            )
            for (const file of acceptedFiles) {
                // filenames are our keys, react will warn about duplicate keys
                if (uniqueNames.has(file.name)) continue
                uniqueNames.add(file.name)

                const compressedFile: Blob = await compressImage(file, {
                    maxSizeMB: 0.5,
                    useWebWorker: false,
                    maxWidthOrHeight: attachmentMaxWidth,
                    maxIteration: 5,
                })
                const dataUrl: string = await readDocumentAsync(compressedFile)
                newAttachments.push({
                    name: file.name,
                    dataUrl,
                    size: compressedFile.size,
                    editorUid: user ? user.uid : 'unkown',
                })
            }
            setAttachments(newAttachments)
            closeAlert()
        },
        [attachmentLimit, attachmentMaxWidth, currentAttachments, user]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        noDrag: true,
    })

    return {
        dropzoneProps: { getRootProps, getInputProps },
        attachments,
        attachmentAlert,
    }
}
