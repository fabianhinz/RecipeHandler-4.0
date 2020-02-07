import {
    Avatar,
    Box,
    CardActionArea,
    createStyles,
    Divider,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Popover,
    Typography,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PeopleIcon from '@material-ui/icons/People'
import Skeleton from '@material-ui/lab/Skeleton'
import { CalendarMonth } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'

import { useAttachment } from '../../hooks/useAttachment'
import { AttachmentDoc, Recipe } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { BORDER_RADIUS } from '../../theme'
import { CategoryResult } from '../Category/CategoryResult'
import { useGridContext } from '../Provider/GridProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { RecipeResultAction } from '../Recipe/Result/Action/RecipeResultAction'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            [theme.breakpoints.down('sm')]: {
                width: 120,
                height: 120,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 150,
                height: 150,
            },
            [theme.breakpoints.up('xl')]: {
                width: 180,
                height: 180,
            },
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderRadius: BORDER_RADIUS,
            fontSize: theme.typography.pxToRem(60),
        },
        skeleton: {
            [theme.breakpoints.down('sm')]: {
                width: 120,
                height: 120,
            },
            [theme.breakpoints.between('sm', 'lg')]: {
                width: 150,
                height: 150,
            },
            [theme.breakpoints.up('xl')]: {
                width: 180,
                height: 180,
            },
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderRadius: BORDER_RADIUS,
        },
        recipeName: {
            fontFamily: "'Lato', sans-serif",
        },
        recipeDate: {
            fontFamily: "'Raleway', sans-serif",
        },
        recipeItem: {
            marginLeft: theme.spacing(2),
        },
        iconButton: {
            position: 'absolute',
            bottom: 4,
            right: 4,
            zIndex: 1,
        },
        paper: {
            position: 'relative',
        },
        popoverPaper: {
            padding: theme.spacing(1),
        },
    })
)

interface Props {
    recipe: Recipe
}

const HomeRecipeCard = ({ recipe }: Props) => {
    const [attachmentDoc, setAttachmentDoc] = useState<AttachmentDoc | undefined>()
    const [actionsAnchorEl, setActionsAnchorEl] = useState<HTMLButtonElement | null>(null)

    const classes = useStyles()

    const { attachmentRef, attachmentRefLoading } = useAttachment(attachmentDoc)
    const { history } = useRouterContext()
    const { gridBreakpointProps } = useGridContext()

    useEffect(() => {
        let mounted = true
        FirebaseService.firestore
            .collection('recipes')
            .doc(recipe.name)
            .collection('attachments')
            .limit(1)
            .get()
            .then(querySnapshot => {
                if (!mounted || querySnapshot.docs.length === 0) return
                setAttachmentDoc(querySnapshot.docs[0].data() as AttachmentDoc)
            })

        return () => {
            mounted = false
        }
    }, [recipe.name])

    return (
        <>
            <Grid {...gridBreakpointProps} item>
                <Paper className={classes.paper}>
                    <IconButton
                        className={classes.iconButton}
                        onClick={e => setActionsAnchorEl(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <CardActionArea
                        onClick={() => history.push(PATHS.details(recipe.name), { recipe })}>
                        <Grid container wrap="nowrap" alignItems="center">
                            <Grid item>
                                {attachmentRefLoading ? (
                                    <Skeleton className={classes.skeleton} variant="rect" />
                                ) : (
                                    <Avatar
                                        variant="rounded"
                                        className={classes.avatar}
                                        src={attachmentRef.smallDataUrl}>
                                        {recipe.name.slice(0, 1).toUpperCase()}
                                    </Avatar>
                                )}
                            </Grid>
                            <Grid className={classes.recipeItem} item zeroMinWidth>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography
                                            gutterBottom
                                            className={classes.recipeName}
                                            variant="h6"
                                            noWrap>
                                            {recipe.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item>
                                                <CalendarMonth />
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    className={classes.recipeDate}
                                                    color="textSecondary">
                                                    {recipe.createdDate
                                                        .toDate()
                                                        .toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item>
                                                <PeopleIcon />
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    className={classes.recipeDate}
                                                    color="textSecondary">
                                                    {recipe.amount}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardActionArea>

                    <Divider />

                    <Box padding={2} paddingLeft={1}>
                        <CategoryResult categories={recipe.categories} />
                    </Box>
                </Paper>
            </Grid>

            <Popover
                open={Boolean(actionsAnchorEl)}
                anchorEl={actionsAnchorEl}
                classes={{ paper: classes.popoverPaper }}
                onClose={() => setActionsAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}>
                <RecipeResultAction name={recipe.name} numberOfComments={recipe.numberOfComments} />
            </Popover>
        </>
    )
}

export default HomeRecipeCard
