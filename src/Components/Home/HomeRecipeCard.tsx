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
    Tooltip,
    Typography,
} from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PeopleIcon from '@material-ui/icons/People'
import Skeleton from '@material-ui/lab/Skeleton'
import { CalendarMonth } from 'mdi-material-ui'
import React, { useState } from 'react'

import { useAttachmentRef } from '../../hooks/useAttachmentRef'
import { AttachmentMetadata, Recipe } from '../../model/model'
import { BORDER_RADIUS } from '../../theme'
import { CategoryResult } from '../Category/CategoryResult'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
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
                width: 200,
                height: 200,
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
                width: 200,
                height: 200,
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
    recipe: Recipe<AttachmentMetadata>
}

export const recentlyAddedGridProps = (
    isHighRes?: boolean
): Partial<Record<Breakpoint, boolean | GridSize>> => ({ xs: 12, md: 6, xl: isHighRes ? 4 : 6 })

const HomeRecipeCard = ({ recipe }: Props) => {
    const [settingsAnchorEl, setSettingsAnchorEl] = useState<HTMLButtonElement | null>(null)

    const classes = useStyles()

    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(recipe.attachments[0])
    const { isHighRes } = useBreakpointsContext()
    const { history } = useRouterContext()

    return (
        <>
            <Grid {...recentlyAddedGridProps(isHighRes)} item>
                <Paper className={classes.paper}>
                    <IconButton
                        className={classes.iconButton}
                        onClick={e => setSettingsAnchorEl(e.currentTarget)}>
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
                                            variant="h5"
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
                open={Boolean(settingsAnchorEl)}
                anchorEl={settingsAnchorEl}
                classes={{ paper: classes.popoverPaper }}
                onClose={() => setSettingsAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}>
                <RecipeResultAction
                    name={recipe.name}
                    pinOnly={false}
                    numberOfComments={recipe.numberOfComments}
                />
            </Popover>
        </>
    )
}

export default HomeRecipeCard
