import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Tooltip,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { Eye } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { CategoryResult } from '../Category/CategoryResult'
import { useGridContext } from '../Provider/GridProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { RecipeResultBookmark } from '../Recipe/Result/Action/RecipeResultBookmark'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            width: '100%',
            height: '100%',
            fontSize: theme.typography.pxToRem(60),
            borderTopLeftRadius: BORDER_RADIUS,
            borderBottomLeftRadius: BORDER_RADIUS,
        },
        avatarContainer: {
            height: '100%',
        },
        cardAction: {
            display: 'flex',
            flexDirection: 'column',
        },
    })
)

interface Props {
    recipe: Recipe
}

const HomeRecipeCard = ({ recipe }: Props) => {
    const [attachmentDoc, setAttachmentDoc] = useState<AttachmentDoc | undefined>()

    const classes = useStyles()

    const { attachmentRef, attachmentRefLoading } = useAttachment(attachmentDoc)
    const { history } = useRouterContext()
    const { gridBreakpointProps, gridLayout } = useGridContext()

    useEffect(() => {
        // ? default preview is overwritten, don't query for attachments
        if (recipe.previewAttachment) return

        let mounted = true
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipe.name)
            .collection('attachments')
            .orderBy('createdDate', 'desc')
            .limit(1)
            .get()
            .then(querySnapshot => {
                if (!mounted || querySnapshot.docs.length === 0) return
                setAttachmentDoc(querySnapshot.docs[0].data() as AttachmentDoc)
            })

        return () => {
            mounted = false
        }
    }, [recipe.name, recipe.previewAttachment])

    return (
        <Grid {...gridBreakpointProps} item>
            <Card>
                <Grid container>
                    <Grid item xs={3} xl={gridLayout === 'list' ? 2 : 5}>
                        <div className={classes.avatarContainer}>
                            {attachmentRefLoading ? (
                                <Skeleton className={classes.avatar} variant="rect" />
                            ) : (
                                <Avatar
                                    variant="square"
                                    className={classes.avatar}
                                    src={recipe.previewAttachment || attachmentRef.smallDataUrl}>
                                    {recipe.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={9} xl={gridLayout === 'list' ? 10 : 7}>
                        <CardHeader
                            classes={{ action: classes.cardAction }}
                            title={recipe.name}
                            subheader={recipe.createdDate.toDate().toLocaleDateString()}
                            action={
                                <>
                                    <Tooltip placement="left" title="Details">
                                        <IconButton
                                            onClick={() =>
                                                history.push(PATHS.details(recipe.name), {
                                                    recipe,
                                                })
                                            }>
                                            <Eye />
                                        </IconButton>
                                    </Tooltip>
                                    <RecipeResultBookmark
                                        tooltipProps={{ placement: 'left' }}
                                        name={recipe.name}
                                    />
                                </>
                            }
                        />
                        <CardContent>
                            <CategoryResult categories={recipe.categories} variant="outlined" />
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default HomeRecipeCard
