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

const useStyles = makeStyles(() => {
    return createStyles({
        // source: https://material-ui.com/components/cards/#cards
        cardMedia: {
            height: 0,
            paddingTop: "56.25%" // 16:9,
        }
    });
});
// ! on readonly those handler don't extist
export interface AttachementsCardChangeHandler {
    onRemoveAttachement?: (attachementName: string) => void;
    onSaveAttachement?: (name: { old: string; new: string }) => void;
}

interface RecipeCreateAttachementsCardProps extends AttachementsCardChangeHandler {
    attachement: AttachementData | AttachementMetadata;
    readonly?: boolean;
}

const RecipeCreateAttachementsCard: FC<RecipeCreateAttachementsCardProps> = ({
    attachement,
    onRemoveAttachement,
    onSaveAttachement,
    readonly
}) => {
    const [visible, setVisible] = useState(true);
    const [name, setName] = useState<string>(attachement.name);
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement);
    const classes = useStyles();

    const cardMedia = () => {
        if (isData(attachement))
            return <CardMedia className={classes.cardMedia} image={attachement.dataUrl} />;
        if (isMetadata(attachement))
            return <CardMedia className={classes.cardMedia} image={attachementRef.dataUrl} />;
    };
    // ! ToDo improve Transition handling (hook?)
    const handleDeleteClick = () => {
        setVisible(false);
        setTimeout(() => onRemoveAttachement!(attachement.name), 200);
    };

    return (
        <Grid item key={attachement.name}>
            <Zoom in={visible} mountOnEnter timeout={200}>
                <Card raised onClick={e => e.stopPropagation()}>
                    {attachementRefLoading ? (
                        <Skeleton variant="rect" className={classes.cardMedia} />
                    ) : (
                        cardMedia()
                    )}
                    <CardHeader
                        title={
                            <TextField
                                disabled={readonly}
                                margin="dense"
                                label="Name"
                                value={name}
                                onChange={event => setName(event.target.value)}
                            />
                        }
                        subheader={`${(attachement.size / 1000000).toFixed(1)} MB`}
                        action={
                            <>
                                {!readonly && (
                                    <>
                                        <IconButton
                                            disabled={attachement.name === name}
                                            onClick={() =>
                                                onSaveAttachement!({
                                                    old: attachement.name,
                                                    new: name
                                                })
                                            }
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton onClick={handleDeleteClick}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
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
