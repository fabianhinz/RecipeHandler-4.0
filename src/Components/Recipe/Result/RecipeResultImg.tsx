import React, { FC } from "react";
import { BORDER_RADIUS } from "../../../theme";
import { createStyles, Grid, makeStyles } from "@material-ui/core";
import { AttachementData, AttachementMetadata } from "../../../model/model";
import { useAttachementRef } from "../../../hooks/useAttachementRef";
import { isData, isMetadata } from "../../../model/modelUtil";
import { Loading } from "../../Shared/Loading";

const ImgGrid: FC = ({ children }) => (
    <Grid xs={12} sm={6} md={4} lg={3} item>
        {children}
    </Grid>
);

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

    if (isData(attachement)) {
        return (
            <ImgGrid>
                <img className={classes.img} src={attachement.dataUrl} alt="" width="100%" />
            </ImgGrid>
        );
    }

    if (isMetadata(attachement)) {
        return (
            <ImgGrid>
                {attachementRefLoading ? (
                    <Loading />
                ) : (
                    <img className={classes.img} src={attachementRef.dataUrl} alt="" />
                )}
            </ImgGrid>
        );
    }
    // ? just to make TypeScript happy...
    return <></>;
};
