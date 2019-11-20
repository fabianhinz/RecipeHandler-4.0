import compressImage from 'browser-image-compression'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { AttachementData, AttachementMetadata } from '../../../../model/model'

export const readDocumentAsync = (document: Blob) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(document)
    })

export const useAttachementDropzone = (
    currentAttachements: Array<AttachementData | AttachementMetadata>
) => {
    const [attachements, setAttachements] = useState<Array<AttachementData>>([])
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: File[]) => {
            if (rejectedFiles.length > 0)
                enqueueSnackbar('Lediglich JPG, PNG sind möglich', {
                    variant: 'error',
                })

            if (acceptedFiles.length > 10)
                return enqueueSnackbar('Mehr als 10 Bilder pro Rezept sind nicht möglich', {
                    variant: 'warning',
                })

            const loadingKey = enqueueSnackbar('Dateien werden komprimiert', {
                variant: 'info',
            })

            const newAttachements: Array<AttachementData> = []
            const uniqueNames = new Set(currentAttachements.map(({ name }) => name))
            for (const file of acceptedFiles) {
                // filenames are our keys, react will warn about duplicate keys
                if (uniqueNames.has(file.name)) continue
                uniqueNames.add(file.name)

                const compressedFile: Blob = await compressImage(file, {
                    maxSizeMB: 0.5,
                    useWebWorker: false,
                    maxWidthOrHeight: 3840,
                    maxIteration: 5,
                })
                const dataUrl: string = await readDocumentAsync(compressedFile)
                newAttachements.push({
                    name: file.name,
                    dataUrl,
                    size: compressedFile.size,
                })
            }
            setAttachements(newAttachements)
            closeSnackbar(loadingKey as string)
        },
        [closeSnackbar, currentAttachements, enqueueSnackbar]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
        noDrag: true,
    })

    return {
        dropzoneProps: { getRootProps, getInputProps },
        attachements,
    }
}
