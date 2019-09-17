import React, { useEffect, useState } from "react";
import { AttachementData, AttachementMetadata, isMetadata } from "../Mock";
import { storage } from "../Firebase";
import { useSnackbar } from "notistack";

export const useAttachementRef = (attachement: AttachementMetadata | AttachementData) => {
    const { name, size } = attachement;
    // ? name, size props are here - don't know if we want to use them
    const [attachementRef, setAttachementRef] = useState<AttachementData>({ name, size, dataUrl: "" });
    const [attachementRefLoading, setAttachementRefLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isMetadata(attachement)) return;

        setAttachementRefLoading(true);
        storage.ref(attachement.fullPath).getDownloadURL()
            .then(dataUrl => setAttachementRef(previous => ({ ...previous, dataUrl })))
            .catch(error => enqueueSnackbar(<>{error.message}</>, { variant: "error" }))
            .finally(() => setAttachementRefLoading(false))
    }, [attachement, enqueueSnackbar]);

    return { attachementRef, attachementRefLoading };
}