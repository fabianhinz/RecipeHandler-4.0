import {
    Avatar,
    Card,
    CardActionArea,
    CardHeader,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Tooltip,
    Typography,
    Zoom,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { Eye } from 'mdi-material-ui'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { CategoryResult } from '../Category/CategoryResult'
import { useGridContext } from '../Provider/GridProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import RecipeBookmarkButton from '../Recipe/RecipeBookmarkButton'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        avatarContainer: {
            position: 'relative',
        },
        userAvatar: {
            height: 25,
            width: 25,
            position: 'absolute',
            top: 8,
            right: 8,
            border: `1px solid ${theme.palette.divider}`,
        },
        avatar: {
            width: '100%',
            height: 200,
            fontSize: theme.typography.pxToRem(60),
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            [theme.breakpoints.up('lg')]: {
                borderTopLeftRadius: BORDER_RADIUS,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: BORDER_RADIUS,
            },
        },
        cardAction: {
            display: 'flex',
            flexDirection: 'column',
        },
        compactPaper: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        },
        card: {
            height: '100%',
        },
        cardContent: {
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        cardHeader: {
            padding: 0,
            paddingBottom: theme.spacing(2),
        },
    })
)

interface Props {
    recipe: Recipe
}

const HomeRecipeCard = ({ recipe }: Props) => {
    const [attachmentDoc, setAttachmentDoc] = useState<AttachmentDoc | undefined>()

    const { attachmentRef, attachmentRefLoading } = useAttachment(attachmentDoc)
    const { history } = useRouterContext()
    const { gridBreakpointProps, gridLayout, compactLayout } = useGridContext()
    const { getByUid } = useUsersContext()

    const classes = useStyles()

    const editor = useMemo(() => getByUid(recipe.editorUid), [getByUid, recipe.editorUid])

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

    const handleRecipeClick = () =>
        history.push(PATHS.details(recipe.name), {
            recipe,
        })

    if (compactLayout)
        return (
            <Grid {...gridBreakpointProps} item>
                <CardActionArea onClick={handleRecipeClick}>
                    <Paper className={classes.compactPaper}>
                        <Typography noWrap variant="h6">
                            {recipe.name}
                        </Typography>
                    </Paper>
                </CardActionArea>
            </Grid>
        )

    return (
        <Grid {...gridBreakpointProps} item>
            <Card className={classes.card}>
                <Grid container>
                    <Grid item xs={12} lg={3} xl={gridLayout === 'list' ? 2 : 5}>
                        {attachmentRefLoading ? (
                            <Skeleton className={classes.avatar} variant="rect" />
                        ) : (
                            <div className={classes.avatarContainer}>
                                <Avatar
                                    variant="square"
                                    className={classes.avatar}
                                    src={recipe.previewAttachment || attachmentRef.smallDataUrl}>
                                    {recipe.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                                {editor && (
                                    <Zoom in mountOnEnter>
                                        <Avatar
                                            className={classes.userAvatar}
                                            src={editor.profilePicture}>
                                            {editor.username.slice(0, 1).toUpperCase()}
                                        </Avatar>
                                    </Zoom>
                                )}
                            </div>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        lg={9}
                        xl={gridLayout === 'list' ? 10 : 7}
                        className={classes.cardContent}>
                        <CardHeader
                            classes={{ action: classes.cardAction, root: classes.cardHeader }}
                            title={recipe.name}
                            subheader={recipe.createdDate.toDate().toLocaleDateString()}
                            action={
                                <>
                                    <Tooltip placement="left" title="Details">
                                        <IconButton onClick={handleRecipeClick}>
                                            <Eye />
                                        </IconButton>
                                    </Tooltip>
                                    <RecipeBookmarkButton
                                        tooltipProps={{ placement: 'left' }}
                                        name={recipe.name}
                                    />
                                </>
                            }
                        />

                        <CategoryResult categories={recipe.categories} variant="outlined" />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default memo(
    HomeRecipeCard,
    (prev, next) =>
        prev.recipe.name === next.recipe.name &&
        prev.recipe.previewAttachment === next.recipe.previewAttachment &&
        prev.recipe.createdDate === next.recipe.createdDate &&
        prev.recipe.categories === next.recipe.categories
)
