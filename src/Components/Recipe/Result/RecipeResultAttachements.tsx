import { Avatar, CardActionArea, createStyles, Grid, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'

import { useAttachementRef } from '../../../hooks/useAttachementRef'
import { AttachementData, AttachementMetadata, MediumDataUrl } from '../../../model/model'
import { BORDER_RADIUS } from '../../../theme'
import { recipeResultBreakpoints } from './RecipeResult'

const useStyles = makeStyles(theme =>
    createStyles({
        attachementPreviewGrid: {
            overflowY: 'auto',
        },
        attachementPreview: {
            width: 200,
            height: 200,
            boxShadow: theme.shadows[1],
        },
        attachement: {
            width: '100%',
            boxShadow: theme.shadows[1],
            borderRadius: BORDER_RADIUS,
        },
        actionArea: {
            borderRadius: '50%',
        },
    })
)

interface AttachementPreviewProps {
    attachement: AttachementMetadata | AttachementData
    onSelect: (dataUrl: MediumDataUrl) => void
}

const AttachementPreview = ({ attachement, onSelect }: AttachementPreviewProps) => {
    const { attachementRef, attachementRefLoading } = useAttachementRef(attachement)
    const classes = useStyles()

    return (
        <Grid item>
            {attachementRefLoading ? (
                <Skeleton variant="circle" className={classes.attachementPreview} />
            ) : (
                <CardActionArea
                    onClick={() => onSelect(attachementRef.mediumDataUrl)}
                    className={classes.actionArea}>
                    <Avatar
                        className={classes.attachementPreview}
                        src={attachementRef.mediumDataUrl}
                    />
                </CardActionArea>
            )}
        </Grid>
    )
}

interface RecipeResultAttachementsProps {
    selectedAttachement: MediumDataUrl | null
    attachements: (AttachementMetadata | AttachementData)[]
    onSelect: (dataUrl: MediumDataUrl) => void
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

            {selectedAttachement && (
                <Grid {...recipeResultBreakpoints()} item>
                    <img src={selectedAttachement} alt="" className={classes.attachement} />
                </Grid>
            )}
        </Grid>
    )
}

export default RecipeResultAttachements
