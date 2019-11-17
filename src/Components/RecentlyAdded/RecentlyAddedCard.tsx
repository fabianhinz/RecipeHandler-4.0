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
import Skeleton from '@material-ui/lab/Skeleton'
import React from 'react'

import { useAttachementRef } from '../../hooks/useAttachementRef'
import { AttachementMetadata, Recipe } from '../../model/model'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { usePinnedRecipesContext } from '../Provider/PinnedRecipesProvider'
import { useRouterContext } from '../Provider/RouterProvider'
import { PATHS } from '../Routes/Routes'

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            width: 80,
            height: 80,
            fontSize: theme.typography.pxToRem(40),
        },
        paper: {
            padding: theme.spacing(2),
        },
    })
)

interface Props {
    recipe: Recipe<AttachementMetadata>
    skeleton: boolean
}

const RecentlyAddedCard = ({ recipe, skeleton }: Props) => {
    const { attachementRef, attachementRefLoading } = useAttachementRef(recipe.attachements[0])
    const { isHighRes } = useBreakpointsContext()
    const { history } = useRouterContext()
    const { pinned } = usePinnedRecipesContext()

    const classes = useStyles()

    const gridProps: Partial<Record<Breakpoint, boolean | GridSize>> = isHighRes
        ? { xs: 12, sm: pinned ? 12 : 6, lg: 4, xl: 3 }
        : { xs: 12, sm: pinned ? 12 : 6, lg: 4 }

    return (
        <Grid {...gridProps} item>
            <CardActionArea onClick={() => history.push(PATHS.details(recipe.name), { recipe })}>
                <Paper className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2} alignItems="center">
                        <Grid item>
                            {attachementRefLoading || skeleton ? (
                                <Skeleton variant="circle" width={80} height={80} />
                            ) : (
                                <Avatar
                                    className={classes.avatar}
                                    src={attachementRef.smallDataUrl}>
                                    {recipe.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                            )}
                        </Grid>
                        <Grid item zeroMinWidth>
                            {skeleton ? (
                                <>
                                    <Skeleton width="4rem" height="1rem" />
                                    <Skeleton width="8rem" height="1rem" />
                                </>
                            ) : (
                                <>
                                    <Typography noWrap variant="subtitle1">
                                        {recipe.name}
                                    </Typography>
                                    <Typography noWrap color="textSecondary">
                                        Erstellt am{' '}
                                        {recipe.createdDate.toDate().toLocaleDateString()}
                                    </Typography>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </CardActionArea>
        </Grid>
    )
}

export default RecentlyAddedCard
