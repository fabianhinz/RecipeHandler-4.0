import {
    Avatar,
    Backdrop,
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Slide,
    useMediaQuery,
} from '@material-ui/core'
import BugIcon from '@material-ui/icons/BugReport'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect } from 'react'

import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { AttachementData, AttachementMetadata, DataUrl } from '../../../model/model'
import { isMetadata } from '../../../model/modelUtil'
import { BORDER_RADIUS } from '../../../theme'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            paddingBottom: theme.spacing(8),
            paddingTop: theme.spacing(8),
            zIndex: theme.zIndex.modal,
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
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
                maxWidth: '90%',
            },
            [theme.breakpoints.only('sm')]: {
                maxWidth: '80%',
            },
            [theme.breakpoints.only('md')]: {
                maxWidth: '70%',
            },
            [theme.breakpoints.only('lg')]: {
                maxWidth: '60%',
            },
            [theme.breakpoints.up('xl')]: {
                maxHeight: '60%',
            },
            borderRadius: BORDER_RADIUS,
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
                    onClick={() => {
                        if (isMetadata(attachement))
                            onSelect(
                                loadHighRes
                                    ? attachementRef.fullDataUrl
                                    : attachementRef.mediumDataUrl
                            )
                        else onSelect(attachement.dataUrl)
                    }}
                    className={classes.actionArea}>
                    <Avatar
                        className={classes.attachementPreview}
                        src={
                            isMetadata(attachement)
                                ? attachementRef.mediumDataUrl
                                : attachement.dataUrl
                        }>
                        <BugIcon fontSize="large" />
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

    useEffect(() => {
        const root = document.getElementsByTagName('html')[0]
        if (selectedAttachement) root.setAttribute('style', 'overflow: hidden;')
        if (!selectedAttachement) root.removeAttribute('style')
    }, [selectedAttachement])

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

            <Slide
                direction="up"
                in={selectedAttachement !== null && selectedAttachement.length > 0}>
                <Backdrop
                    open
                    onClick={() => onSelect(selectedAttachement as string)}
                    className={classes.backdrop}>
                    {selectedAttachement && (
                        <img
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
