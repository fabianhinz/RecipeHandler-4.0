import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { storageService } from "../firebase";
import { AttachementMetadata, AttachementData } from "../model/model";
import { isMetadata } from "../model/modelUtil";

export const useAttachementRef = (attachement: AttachementMetadata | AttachementData) => {
    const { name, size } = attachement;
    // ? name, size props are here - don't know if we want to use them
    const [attachementRef, setAttachementRef] = useState<AttachementData>({
        name,
        size,
        dataUrl: ""
    });
    const [attachementRefLoading, setAttachementRefLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isMetadata(attachement)) return;

        setAttachementRefLoading(true);
        storageService
            .ref(attachement.fullPath)
            .getDownloadURL()
            .then(dataUrl => setAttachementRef(previous => ({ ...previous, dataUrl })))
            .catch(error => enqueueSnackbar(<>{error.message}</>, { variant: "error" }))
            .finally(() => setAttachementRefLoading(false));
    }, [attachement, enqueueSnackbar]);

    return { attachementRef, attachementRefLoading };
};
