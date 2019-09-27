import React, { FC } from "react";
import { BORDER_RADIUS } from "../../../theme";
import { createStyles, Grid, makeStyles, Tooltip } from "@material-ui/core";
import { AttachementData, AttachementMetadata } from "../../../model/model";
import { useAttachementRef } from "../../../hooks/useAttachementRef";
import { isData } from "../../../model/modelUtil";

import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles(theme =>
    createStyles({
        img: {
            borderRadius: BORDER_RADIUS,
            width: "100%"
        },
        progress: {
            flexGrow: 1,
            borderRadius: 16,
            height: theme.spacing(1)
        }
    })
);

interface RecipeResultImgProps {
    attachement: AttachementData | AttachementMetadata;
}

export const RecipeResultImg: FC<RecipeResultImgProps> = ({ attachement }) => {
    const classes = useStyles();
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement);

    return (
        <Grid xs={12} sm={6} md={4} lg={3} item>
            <Tooltip title={attachement.name}>
                {attachementRefLoading ? (
                    <Skeleton className={classes.img} variant="rect" height={200} />
                ) : isData(attachement) ? (
                    <img className={classes.img} src={attachement.dataUrl} alt="" width="100%" />
                ) : (
                    <a href={attachementRef.fullDataUrl} rel="noreferrer noopener" target="_blank">
                        <img className={classes.img} src={attachementRef.mediumDataUrl} alt="" />
                    </a>
                )}
            </Tooltip>
        </Grid>
    );
};
