import { AttachmentData, AttachmentMetadata } from './model'

export const isData = (
    attachment: AttachmentData | AttachmentMetadata
): attachment is AttachmentData => {
    return attachment && (attachment as AttachmentData).dataUrl !== undefined
}

export const isMetadata = (
    attachment: AttachmentData | AttachmentMetadata
): attachment is AttachmentMetadata => {
    return attachment && (attachment as AttachmentMetadata).fullPath !== undefined
}
