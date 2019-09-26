import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import React, { FC, memo, useState } from "react";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Skeleton from "@material-ui/lab/Skeleton";
import {
    Card,
    CardHeader,
    CardMedia,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    Zoom
} from "@material-ui/core";
import { AttachementData, AttachementMetadata } from "../../../../model/model";
import { useAttachementRef } from "../../../../hooks/useAttachementRef";
import { isData, isMetadata } from "../../../../model/modelUtil";
import { useTransition } from "../../../../hooks/useTransition";

const useStyles = makeStyles(() => {
    return createStyles({
        // source: https://material-ui.com/components/cards/#cards
        cardMedia: {
            height: 0,
            paddingTop: "56.25%" // 16:9,
        }
    });
});
export interface AttachementsCardChangeHandler {
    onDeleteAttachement: (name: string, path: string) => void;
    onRemoveAttachement: (attachementName: string) => void;
    onSaveAttachement: (name: { old: string; new: string }) => void;
}

interface RecipeCreateAttachementsCardProps extends AttachementsCardChangeHandler {
    attachement: AttachementData | AttachementMetadata;
}

const RecipeCreateAttachementsCard: FC<RecipeCreateAttachementsCardProps> = ({
    attachement,
    onRemoveAttachement,
    onDeleteAttachement,
    onSaveAttachement
}) => {
    const [name, setName] = useState<string>(attachement.name);
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement);
    const { componentVisible, componentTransition } = useTransition();
    const classes = useStyles();

    const handleDeleteClick = () => {
        if (isMetadata(attachement)) {
            componentTransition(() => onDeleteAttachement(attachement.name, attachement.fullPath));
        } else {
            componentTransition(() => onRemoveAttachement(attachement.name));
        }
    };

    const handleSaveClick = () =>
        onSaveAttachement({
            old: attachement.name,
            new: name
        });

    return (
        <Grid xs={12} sm={6} md={4} lg={3} item>
            <Zoom in={componentVisible} mountOnEnter timeout={200}>
                <Card raised onClick={e => e.stopPropagation()}>
                    {attachementRefLoading ? (
                        <Skeleton variant="rect" className={classes.cardMedia} />
                    ) : isMetadata(attachement) ? (
                        <CardMedia className={classes.cardMedia} image={attachementRef.dataUrl} />
                    ) : (
                        <CardMedia className={classes.cardMedia} image={attachement.dataUrl} />
                    )}
                    <CardHeader
                        title={
                            <TextField
                                margin="dense"
                                label="Name"
                                value={name}
                                onChange={event => setName(event.target.value)}
                            />
                        }
                        subheader={`${(attachement.size / 1000000).toFixed(1)} MB`}
                        action={
                            <>
                                <IconButton
                                    disabled={attachement.name === name}
                                    onClick={handleSaveClick}
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton onClick={handleDeleteClick}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    />
                </Card>
            </Zoom>
        </Grid>
    );
};

export default memo(RecipeCreateAttachementsCard, (prev, next) => {
    let sameAttachement = true;
    if (isData(prev.attachement) && isData(next.attachement)) {
        sameAttachement = prev.attachement.dataUrl === next.attachement.dataUrl;
    }
    if (isMetadata(prev.attachement) && isMetadata(next.attachement)) {
        sameAttachement = prev.attachement.fullPath === next.attachement.fullPath;
    }
    return (
        sameAttachement &&
        prev.attachement.name === next.attachement.name &&
        prev.onSaveAttachement === next.onSaveAttachement
    );
});
