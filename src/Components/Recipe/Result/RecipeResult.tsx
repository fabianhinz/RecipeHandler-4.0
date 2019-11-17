import { Box, createStyles, Divider, Grid, makeStyles, Slide } from '@material-ui/core'
import { GridSize } from '@material-ui/core/Grid'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { ReactComponent as NotFoundIcon } from '../../../icons/notFound.svg'
import { AttachementData, AttachementMetadata, MediumDataUrl, Recipe } from '../../../model/model'
import { useRouterContext } from '../../Provider/RouterProvider'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'
import { RecipeVariants } from './Action/RecipeResultAction'
import RecipeResultAttachements from './RecipeResultAttachements'
import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeVariants {
    recipe: Recipe<AttachementMetadata | AttachementData> | null
}

const useStyles = makeStyles(() =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
        markdown: {
            fontSize: '1rem',
            lineHeight: '1.5rem',
        },
    })
)

export const recipeResultBreakpoints = (
    fullWidth?: boolean
): Partial<Record<Breakpoint, boolean | GridSize>> =>
    fullWidth ? { xs: 12 } : { xs: 12, lg: 6, xl: 4 }

const RecipeResult = ({ recipe, variant }: RecipeResultProps) => {
    const [selectedAttachement, setSelectedAttachement] = useState<MediumDataUrl | null>(null)
    const { location } = useRouterContext()
    const classes = useStyles()

    useEffect(() => {
        setSelectedAttachement(null)
    }, [location.pathname])

    if (!recipe)
        return (
            <Box display="flex" justifyContent="center">
                <Slide in direction="down" timeout={500}>
                    <NotFoundIcon width={200} />
                </Slide>
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

    const handleAttachementSelect = (attachement: MediumDataUrl) => {
        if (selectedAttachement === attachement) setSelectedAttachement(null)
        else setSelectedAttachement(attachement)
    }

    return (
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
                    <RecipeResultAttachements
                        attachements={recipe.attachements}
                        selectedAttachement={selectedAttachement}
                        onSelect={handleAttachementSelect}
                    />
                </Grid>
            )}

            <Grid {...breakpoints} item>
                <RecipeCard
                    variant={variant}
                    header={
                        <Subtitle
                            noMargin
                            icon={<AssignmentIcon />}
                            text={
                                <>
                                    Zutaten für {recipe.amount}{' '}
                                    {recipe.amount < 2 ? 'Person' : 'Personen'}
                                </>
                            }
                        />
                    }
                    content={
                        <ReactMarkdown className={classes.markdown} source={recipe.ingredients} />
                    }
                />
            </Grid>

            <Grid {...breakpoints} item>
                <RecipeCard
                    variant={variant}
                    header={<Subtitle noMargin icon={<BookIcon />} text="Beschreibung" />}
                    content={
                        <ReactMarkdown className={classes.markdown} source={recipe.description} />
                    }
                />
            </Grid>

            {recipe.relatedRecipes.length > 0 && (
                <Grid {...breakpoints} item>
                    <RecipeCard
                        variant={variant}
                        header={<Subtitle noMargin icon={<LabelIcon />} text="Passt gut zu" />}
                        content={<RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default memo(
    RecipeResult,
    (prev, next) => prev.recipe === next.recipe && prev.variant === next.variant
)
