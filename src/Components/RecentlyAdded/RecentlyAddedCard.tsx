import {
    Avatar,
    CardActionArea,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import PeopleIcon from '@material-ui/icons/People'
import Skeleton from '@material-ui/lab/Skeleton'
import { CalendarMonth } from 'mdi-material-ui'
import React from 'react'

import { useAttachmentRef } from '../../hooks/useAttachmentRef'
import { AttachmentMetadata, Recipe } from '../../model/model'
import { BORDER_RADIUS } from '../../theme'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { usePinnedRecipesContext } from '../Provider/PinnedRecipesProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            width: 140,
            height: 140,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            fontSize: theme.typography.pxToRem(60),
        },
        skeleton: {
            width: 140,
            height: 140,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
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
    })
)

interface Props {
    recipe: Recipe<AttachmentMetadata>
    skeleton: boolean
}

export const recentlyAddedGridProps = (
    isHighRes?: boolean,
    pinned?: boolean
): Partial<Record<Breakpoint, boolean | GridSize>> =>
    isHighRes
        ? { xs: 12, sm: pinned ? 12 : 6, lg: 4, xl: 3 }
        : { xs: 12, sm: pinned ? 12 : 6, lg: 4 }

const RecentlyAddedCard = ({ recipe, skeleton }: Props) => {
    const { attachmentRef, attachmentRefLoading } = useAttachmentRef(recipe.attachments[0])
    const { isHighRes } = useBreakpointsContext()
    const { history } = useRouterContext()
    const { pinnedOnDesktop } = usePinnedRecipesContext()

    const classes = useStyles()

    return (
        <Grid {...recentlyAddedGridProps(isHighRes, pinnedOnDesktop)} item>
            <CardActionArea onClick={() => history.push(PATHS.details(recipe.name), { recipe })}>
                <Paper>
                    <Grid container wrap="nowrap" alignItems="center">
                        <Grid item>
                            {attachmentRefLoading || skeleton ? (
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
                            {skeleton ? (
                                <>
                                    <Skeleton width="4rem" height="1rem" />
                                    <Skeleton width="8rem" height="1rem" />
                                </>
                            ) : (
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
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </CardActionArea>
        </Grid>
    )
}

export default RecentlyAddedCard
