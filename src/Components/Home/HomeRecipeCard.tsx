import {
    Avatar,
    Card,
    CardActionArea,
    Grid,
    makeStyles,
    Paper,
    Typography,
    Zoom,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { memo, useEffect, useMemo, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import useImgSrcLazy from '../../hooks/useImgSrcLazy'
import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { CategoryResult } from '../Category/CategoryResult'
import { useGridContext } from '../Provider/GridProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { useUsersContext } from '../Provider/UsersProvider'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme => ({
    avatarContainer: {
        position: 'relative',
    },
    userAvatar: {
        height: 40,
        width: 40,
        border: `2px solid ${theme.palette.divider}`,
        position: 'absolute',
        top: 8,
        right: 8,
    },
    avatar: {
        width: '100%',
        height: 300,
        fontSize: theme.typography.pxToRem(60),
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: BORDER_RADIUS,
        [theme.breakpoints.up('lg')]: {
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: BORDER_RADIUS,
        },
    },
    compactPaper: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    card: {
        height: '100%',
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        height: '66%',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'flex-end',
        background:
            theme.palette.type === 'dark'
                ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
                : 'linear-gradient(to top, rgba(255,255,255,0.8), rgba(0,0,0,0))',
    },
}))

interface Props {
    recipe: Recipe
    lastCookedDate?: firebase.firestore.Timestamp
}

const HomeRecipeCard = ({ recipe, lastCookedDate }: Props) => {
    const [attachmentDoc, setAttachmentDoc] = useState<AttachmentDoc | undefined>()

    const { attachmentRef } = useAttachment(attachmentDoc)
    const { imgSrc, imgLoading } = useImgSrcLazy({
        src: recipe.previewAttachment || attachmentRef.mediumDataUrl,
        skipOnUndefined: true,
    })

    const { history } = useRouterContext()
    const { gridBreakpointProps, compactLayout } = useGridContext()
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
        <Grid item xs={6} md={3} xl={2}>
            <Card className={classes.card}>
                <CardActionArea onClick={handleRecipeClick}>
                    {imgLoading ? (
                        <Skeleton className={classes.avatar} variant="rect" />
                    ) : (
                        <div className={classes.avatarContainer}>
                            <Avatar variant="square" className={classes.avatar} src={imgSrc}>
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
                            <div className={classes.avatarOverlay}>
                                <Typography variant="h6" gutterBottom>
                                    {recipe.name}
                                </Typography>

                                <CategoryResult categories={recipe.categories} variant="outlined" />
                            </div>
                        </div>
                    )}
                </CardActionArea>
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
