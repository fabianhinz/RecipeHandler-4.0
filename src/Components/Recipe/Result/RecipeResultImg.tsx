import React, { FC } from "react";
import { BORDER_RADIUS } from "../../../theme";
import { createStyles, Grid, makeStyles, Tooltip } from "@material-ui/core";
import { AttachementData, AttachementMetadata } from "../../../model/model";
import { useAttachementRef } from "../../../hooks/useAttachementRef";
import { isData } from "../../../model/modelUtil";
import { Loading } from "../../Shared/Loading";
import { GridSize } from "@material-ui/core/Grid";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

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
    fromRelated?: boolean;
}

export const RecipeResultImg: FC<RecipeResultImgProps> = ({ attachement, fromRelated }) => {
    const classes = useStyles();
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement);

    if (attachementRefLoading) return <Loading />;

    const breakpoints: Partial<Record<Breakpoint, boolean | GridSize>> = fromRelated
        ? { xs: 12, md: 6 }
        : { xs: 12, sm: 6, md: 4, lg: 3 };

    return (
        <Grid {...breakpoints} item>
            <Tooltip title={attachement.name}>
                {isData(attachement) ? (
                    <img className={classes.img} src={attachement.dataUrl} alt="" width="100%" />
                ) : (
                    <img className={classes.img} src={attachementRef.dataUrl} alt="" />
                )}
            </Tooltip>
        </Grid>
    );
};
