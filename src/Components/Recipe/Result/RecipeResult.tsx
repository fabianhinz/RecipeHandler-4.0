import {
    Avatar,
    Box,
    createStyles,
    Divider,
    Grid,
    Grow,
    makeStyles,
    Paper,
    Slide,
    Typography,
} from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { memo } from 'react'

import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { AttachmentData, AttachmentMetadata, Recipe } from '../../../model/model'
import { BORDER_RADIUS_HUGE } from '../../../theme'
import Markdown from '../../Shared/Markdown'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'
import { RecipeVariants } from './Action/RecipeResultAction'
import RecipeResultAttachments from './RecipeResultAttachments'
import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeVariants {
    recipe: Recipe<AttachmentMetadata | AttachmentData> | null
}

const useStyles = makeStyles(theme =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
        editorBatch: {
            borderRadius: `0 0 ${BORDER_RADIUS_HUGE}px ${BORDER_RADIUS_HUGE}px`,
            padding: theme.spacing(1),
            position: 'fixed',
            top: 0,
            right: theme.spacing(2),
        },
    })
)

export const recipeResultBreakpoints = (
    fullWidth?: boolean
): Partial<Record<Breakpoint, boolean | GridSize>> =>
    fullWidth ? { xs: 12 } : { xs: 12, lg: 6, xl: 4 }

const RecipeResult = ({ recipe, variant }: RecipeResultProps) => {
    const classes = useStyles()

    if (!recipe)
        return (
            <Box display="flex" justifyContent="center" marginTop={4}>
                <Grow in timeout={500}>
                    <NotFoundIcon width={200} />
                </Grow>
            </Box>
        )

    if (variant === 'summary')
        return (
            <Grid container spacing={4} className={classes.recipeContainer} alignContent="stretch">
                <Grid item xs={12}>
                    <RecipeResultHeader recipe={recipe} variant={variant} />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
        )

    const breakpoints = recipeResultBreakpoints(variant === 'pinned')

    return (
        <>
            <Grid
                container
                spacing={variant === 'pinned' ? 2 : 4}
                className={classes.recipeContainer}
                alignContent="stretch">
                <Grid item xs={12}>
                    <RecipeResultHeader recipe={recipe} variant={variant} />
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {variant !== 'pinned' && (
                    <Grid item xs={12}>
                        <RecipeResultAttachments attachments={recipe.attachments} />
                    </Grid>
                )}

                {recipe.ingredients.length > 0 && (
                    <Grid {...breakpoints} item>
                        <RecipeCard
                            variant={variant}
                            header={
                                <Subtitle
                                    icon={<AssignmentIcon />}
                                    text={
                                        <>
                                            Zutaten für {recipe.amount}{' '}
                                            {recipe.amount < 2 ? 'Person' : 'Personen'}
                                        </>
                                    }
                                />
                            }
                            content={<Markdown source={recipe.ingredients} />}
                        />
                    </Grid>
                )}

                {recipe.description.length > 0 && (
                    <Grid {...breakpoints} item>
                        <RecipeCard
                            variant={variant}
                            header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
                            content={<Markdown source={recipe.description} />}
                        />
                    </Grid>
                )}

                {recipe.relatedRecipes.length > 0 && variant !== 'pinned' && (
                    <Grid {...breakpoints} item>
                        <RecipeCard
                            variant={variant}
                            header={<Subtitle icon={<LabelIcon />} text="Passt gut zu" />}
                            content={<RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />}
                        />
                    </Grid>
                )}
            </Grid>

            <Slide in={variant === 'details'} timeout={1000} direction="down">
                <Paper className={classes.editorBatch}>
                    <Grid container spacing={1} justify="flex-start" alignItems="center">
                        <Grid item xs>
                            <Avatar>{recipe.editor!.username.slice(0, 1)}</Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography noWrap color="textSecondary">
                                {recipe.editor!.username}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Slide>
        </>
    )
}

export default memo(
    RecipeResult,
    (prev, next) => prev.recipe === next.recipe && prev.variant === next.variant
)
