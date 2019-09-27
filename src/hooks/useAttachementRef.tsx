import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { AttachementMetadata, AttachementData } from "../model/model";
import { isMetadata } from "../model/modelUtil";
import { FirebaseService } from "../firebase";

interface State {
    base: Omit<AttachementData, "dataUrl">;
    fullDataUrl: string;
    mediumDataUrl: string;
    smallDataUrl: string;
}

const initialDataUrls = { fullDataUrl: "", mediumDataUrl: "", smallDataUrl: "" };

const getResizedImages = async (fullPath: string) => {
    // ? the fullPath Field in firestore always looks something like [whatever].jpg|png
    const extension = fullPath.split(".").slice(-1)[0];
    const basePath = fullPath.replace(`.${extension}`, "");

    const urls: Omit<State, "base"> = { ...initialDataUrls };
    const { storage } = FirebaseService;

    urls.fullDataUrl = await storage.ref(fullPath).getDownloadURL();
    urls.mediumDataUrl = await storage.ref(`${basePath}_1000x1000.${extension}`).getDownloadURL();
    urls.smallDataUrl = await storage.ref(`${basePath}_400x400.${extension}`).getDownloadURL();

    return urls;
};

export const useAttachementRef = (attachement: AttachementMetadata | AttachementData) => {
    const [attachementRef, setAttachementRef] = useState<State>({
        base: {
            name: attachement && attachement.name,
            size: attachement && attachement.size
        },
        ...initialDataUrls
    });
    const [attachementRefLoading, setAttachementRefLoading] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isMetadata(attachement)) return setAttachementRefLoading(false);

        getResizedImages(attachement.fullPath).then(urls => {
            setAttachementRef(previous => ({ ...previous, ...urls }));
            setAttachementRefLoading(false);
        });
    }, [attachement, enqueueSnackbar]);

    return { attachementRef, attachementRefLoading };
};
