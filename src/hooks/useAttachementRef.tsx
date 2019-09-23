import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { AttachementMetadata, AttachementData } from "../model/model";
import { isMetadata } from "../model/modelUtil";
import { FirebaseService } from "../firebase";

export const useAttachementRef = (attachement: AttachementMetadata | AttachementData) => {
    const [attachementRef, setAttachementRef] = useState<AttachementData>({
        name: attachement && attachement.name,
        size: attachement && attachement.size,
        dataUrl: ""
    });
    const [attachementRefLoading, setAttachementRefLoading] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isMetadata(attachement)) return setAttachementRefLoading(false);

        FirebaseService.storage
            .ref(attachement.fullPath)
            .getDownloadURL()
            .then(dataUrl => setAttachementRef(previous => ({ ...previous, dataUrl })))
            .catch(error => enqueueSnackbar(<>{error.message}</>, { variant: "error" }))
            .finally(() => setAttachementRefLoading(false));
    }, [attachement, enqueueSnackbar]);

    return { attachementRef, attachementRefLoading };
};
