import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { AttachementMetadata, AttachementData } from "../model/model";
import { isMetadata } from "../model/modelUtil";
import { FirebaseService } from "../firebase";

export const useAttachementRef = (attachement: AttachementMetadata | AttachementData) => {
    const { name, size } = attachement;
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
        FirebaseService.storage
            .ref(attachement.fullPath)
            .getDownloadURL()
            .then(dataUrl => setAttachementRef(previous => ({ ...previous, dataUrl })))
            .catch(error => enqueueSnackbar(<>{error.message}</>, { variant: "error" }))
            .finally(() => setAttachementRefLoading(false));
    }, [attachement, enqueueSnackbar]);

    return { attachementRef, attachementRefLoading };
};
