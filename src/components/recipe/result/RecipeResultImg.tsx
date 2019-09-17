import React, { FC } from "react";
import {
    AttachementData,
    AttachementMetadata,
    isData,
    isMetadata
    } from "../../../util/Mock";
import { BORDER_RADIUS } from "../../../Theme";
import {
    Box,
    createStyles,
    Grid,
    LinearProgress,
    makeStyles
    } from "@material-ui/core";
import { useAttachementRef } from "../../../util/hooks/useAttachementRef";

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

const ImgGrid: FC = ({ children }) => <Grid xs={12} sm={6} md={4} lg={3} item>{children}</Grid>

interface RecipeResultImgProps {
    attachement: AttachementData | AttachementMetadata;
}

export const RecipeResultImg: FC<RecipeResultImgProps> = ({ attachement }) => {
    const classes = useStyles();
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)

    if (isData(attachement)) {
        return (
            <ImgGrid>
                <img className={classes.img} src={attachement.dataUrl} alt="" width="100%" />
            </ImgGrid>
        )
    }

    if (isMetadata(attachement)) {
        return (
            <ImgGrid>
                {
                    attachementRefLoading
                        ? <Box height="100%" minHeight={50} display="flex" justifyContent="center" alignItems="center">
                            <LinearProgress className={classes.progress} color="secondary" variant="query" />
                        </Box>
                        : <img className={classes.img} src={attachementRef.dataUrl} alt="" />
                }
            </ImgGrid>
        )
    }
    // ? just to make TypeScript happy...
    return <></>;
}
