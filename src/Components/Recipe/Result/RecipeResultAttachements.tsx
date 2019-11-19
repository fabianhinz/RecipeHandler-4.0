import {
    Avatar,
    Backdrop,
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Slide,
    Typography,
    useMediaQuery,
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { AttachementData, AttachementMetadata, DataUrl } from '../../../model/model'
import { BORDER_RADIUS } from '../../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            paddingBottom: theme.spacing(8),
            paddingTop: theme.spacing(8),
            zIndex: theme.zIndex.drawer - 1,
            display: 'flex',
            justifyContent: 'center',
        },
        attachementPreviewGrid: {
            overflowX: 'auto',
        },
        attachementPreview: {
            width: 200,
            height: 200,
            boxShadow: theme.shadows[1],
        },
        attachement: {
            [theme.breakpoints.only('xs')]: {
                width: '90%',
            },
            [theme.breakpoints.only('sm')]: {
                width: '80%',
            },
            [theme.breakpoints.only('md')]: {
                width: '70%',
            },
            [theme.breakpoints.only('lg')]: {
                width: '60%',
            },
            [theme.breakpoints.up('xl')]: {
                width: '50%',
            },
            borderRadius: BORDER_RADIUS,
            cursor: 'pointer',
        },
        actionArea: {
            borderRadius: '50%',
        },
    })
)

interface AttachementPreviewProps {
    attachement: AttachementMetadata | AttachementData
    onSelect: (dataUrl: DataUrl) => void
}

const AttachementPreview = ({ attachement, onSelect }: AttachementPreviewProps) => {
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)
    const loadHighRes = useMediaQuery('(min-width: 2000px)')
    const classes = useStyles()

    return (
        <Grid item>
            {attachementRefLoading ? (
                <Skeleton variant="circle" className={classes.attachementPreview} />
            ) : (
                <CardActionArea
                    onClick={() =>
                        onSelect(
                            loadHighRes ? attachementRef.fullDataUrl : attachementRef.mediumDataUrl
                        )
                    }
                    className={classes.actionArea}>
                    <Avatar
                        className={classes.attachementPreview}
                        src={attachementRef.mediumDataUrl}>
                        <Typography variant="h1">?</Typography>
                    </Avatar>
                </CardActionArea>
            )}
        </Grid>
    )
}

interface RecipeResultAttachementsProps {
    selectedAttachement: DataUrl | null
    attachements: (AttachementMetadata | AttachementData)[]
    onSelect: (dataUrl: DataUrl) => void
}

const RecipeResultAttachements = ({
    attachements,
    selectedAttachement,
    onSelect,
}: RecipeResultAttachementsProps) => {
    const classes = useStyles()

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Grid
                    wrap="nowrap"
                    className={classes.attachementPreviewGrid}
                    container
                    spacing={2}
                    justify="flex-start">
                    {attachements.map(attachement => (
                        <AttachementPreview
                            onSelect={onSelect}
                            attachement={attachement}
                            key={attachement.name}
                        />
                    ))}
                </Grid>
            </Grid>

            <Slide direction="up" in={selectedAttachement !== null}>
                <Backdrop open className={classes.backdrop}>
                    {selectedAttachement && (
                        <img
                            onClick={() => onSelect(selectedAttachement as string)}
                            src={selectedAttachement}
                            className={classes.attachement}
                            alt="selected"
                        />
                    )}
                </Backdrop>
            </Slide>
        </Grid>
    )
}

export default RecipeResultAttachements
