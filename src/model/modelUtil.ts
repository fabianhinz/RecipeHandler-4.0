import { AttachementData, AttachementMetadata } from "./model";

export const isData = (
    attachement: AttachementData | AttachementMetadata
): attachement is AttachementData => {
    return (attachement as AttachementData).dataUrl !== undefined;
};

export const isMetadata = (
    attachement: AttachementData | AttachementMetadata
): attachement is AttachementMetadata => {
    return (attachement as AttachementMetadata).fullPath !== undefined;
};
