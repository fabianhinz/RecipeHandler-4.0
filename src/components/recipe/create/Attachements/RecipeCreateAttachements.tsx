import AddIcon from "@material-ui/icons/AddCircleTwoTone";
import compressImage from "browser-image-compression";
import React, { FC, useCallback, useEffect } from "react";
import RecipeCreateAttachementsCard, {
    AttachementsCardChangeHandler
} from "./RecipeCreateAttachementsCard";
import { createStyles, Fab, Grid, makeStyles } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";
import { AttachementData, AttachementMetadata } from "../../../../model/model";

const readDocumentAsync = (document: Blob) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(document);
    });

const useStyles = makeStyles(theme => {
    return createStyles({
        rootProps: {
            outline: "none"
        },
        dropActive: {
            background: theme.palette.primary.light
        },
        addIcon: {
            marginRight: theme.spacing(1)
        }
    });
});

interface RecipeCreateAttachementsProps extends AttachementsCardChangeHandler {
    onAttachements: (newFiles: Array<AttachementData>) => void;
    attachements: Array<AttachementData | AttachementMetadata>;
}

export const RecipeCreateAttachements: FC<RecipeCreateAttachementsProps> = props => {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: File[]) => {
            if (rejectedFiles.length > 0)
                enqueueSnackbar(<>Lediglich JPG, PNG sind möglich</>, {
                    variant: "error"
                });

            if (acceptedFiles.length > 10)
                return enqueueSnackbar(<>Mehr als 10 Bilder pro Rezept sind nicht möglich</>, {
                    variant: "warning"
                });

            const loadingKey = enqueueSnackbar(<>Dateien werden komprimiert</>, {
                variant: "info"
            });

            const newFiles: Array<AttachementData> = [];
            const uniqueNames = new Set(props.attachements.map(({ name }) => name));
            for (const file of acceptedFiles) {
                // filenames are our keys, react will warn about duplicate keys
                if (uniqueNames.has(file.name)) continue;
                uniqueNames.add(file.name);

                const compressedFile: Blob = await compressImage(file, {
                    maxSizeMB: 0.5,
                    useWebWorker: false,
                    maxWidthOrHeight: 3840,
                    maxIteration: 5
                });
                const dataUrl: string = await readDocumentAsync(compressedFile);
                newFiles.push({
                    name: file.name,
                    dataUrl,
                    size: compressedFile.size
                });
            }
            props.onAttachements(newFiles);
            closeSnackbar(loadingKey as string);
        },
        [closeSnackbar, enqueueSnackbar, props]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/jpeg, image/png"
    });

    useEffect(() => {
        if (isDragActive)
            enqueueSnackbar(<>Bilder ablegen um sie mit dem Rezept zu verknüpfen</>, {
                variant: "info"
            });
        else closeSnackbar();
    }, [closeSnackbar, enqueueSnackbar, isDragActive]);

    return (
        <Grid container spacing={2}>
            {props.attachements.map(attachement => (
                <RecipeCreateAttachementsCard
                    key={attachement.name}
                    attachement={attachement}
                    onRemoveAttachement={props.onRemoveAttachement}
                    onSaveAttachement={props.onSaveAttachement}
                />
            ))}
            <Grid item xs={12}>
                <Grid container justify="center">
                    <div {...getRootProps()} className={classes.rootProps}>
                        <input {...getInputProps()} />
                        <Fab size="medium" color="primary" variant="extended">
                            <AddIcon className={classes.addIcon} />
                            Bilder hinzufügen
                        </Fab>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
};
