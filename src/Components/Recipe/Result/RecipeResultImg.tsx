import { Card, CardMedia, createStyles, Grid, makeStyles } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React from 'react'

import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { AttachementData, AttachementMetadata } from '../../../model/model'
import { isData } from '../../../model/modelUtil'

const useStyles = makeStyles(theme =>
    createStyles({
        cardMedia: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
    })
)

interface RecipeResultImgProps {
    attachement: AttachementData | AttachementMetadata
}

export const RecipeResultImg = ({ attachement }: RecipeResultImgProps) => {
    const classes = useStyles()
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)

    return (
        <Grid item xs={12}>
            <Card elevation={0}>
                {attachementRefLoading ? (
                    <Skeleton className={classes.cardMedia} variant="rect" />
                ) : isData(attachement) ? (
                    <CardMedia className={classes.cardMedia} image={attachement.dataUrl} />
                ) : (
                    <a href={attachementRef.fullDataUrl} rel="noreferrer noopener" target="_blank">
                        <CardMedia
                            className={classes.cardMedia}
                            image={attachementRef.mediumDataUrl}
                        />
                    </a>
                )}
            </Card>
        </Grid>
    )
}
