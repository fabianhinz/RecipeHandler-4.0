import { Card, CardMedia, createStyles, Grid, makeStyles, Tooltip } from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { FC } from 'react'

import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { AttachementData, AttachementMetadata } from '../../../model/model'
import { isData } from '../../../model/modelUtil'
import { RecipeActions } from './Action/RecipeResultAction'

const useStyles = makeStyles(theme =>
    createStyles({
        cardMedia: {
            height: 0,
            paddingTop: '56.25%', // 16:9,
        },
    })
)

interface RecipeResultImgProps extends RecipeActions {
    attachement: AttachementData | AttachementMetadata
}

export const RecipeResultImg: FC<RecipeResultImgProps> = ({ attachement, actionProps }) => {
    const classes = useStyles()
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)

    const breakpoints: Partial<Record<Breakpoint, boolean | GridSize>> = actionProps.draggEnabled
        ? { xs: 12 }
        : { xs: 12, sm: 6, md: 4, lg: 3 }

    return (
        <Grid {...breakpoints} item>
            <Tooltip title={attachement.name}>
                <Card elevation={0}>
                    {attachementRefLoading ? (
                        <Skeleton className={classes.cardMedia} variant="rect" />
                    ) : isData(attachement) ? (
                        <CardMedia className={classes.cardMedia} image={attachement.dataUrl} />
                    ) : (
                        <a
                            href={attachementRef.fullDataUrl}
                            rel="noreferrer noopener"
                            target="_blank">
                            <CardMedia
                                className={classes.cardMedia}
                                image={attachementRef.mediumDataUrl}
                            />
                        </a>
                    )}
                </Card>
            </Tooltip>
        </Grid>
    )
}
