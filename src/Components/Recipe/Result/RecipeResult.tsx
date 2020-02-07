import { createStyles, Divider, Grid, makeStyles } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { memo } from 'react'

import { Recipe } from '../../../model/model'
import AccountChip from '../../Account/AccountChip'
import MarkdownRenderer from '../../Markdown/MarkdownRenderer'
import { useGridContext } from '../../Provider/GridProvider'
import Satisfaction from '../../Satisfaction/Satisfaction'
import NotFound from '../../Shared/NotFound'
import StyledCard from '../../Shared/StyledCard'
import { RecipeVariants } from './Action/RecipeResultAction'
import RecipeResultAttachments from './RecipeResultAttachments'
import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeVariants {
    recipe: Recipe | null
    divider?: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
    })
)

const RecipeResult = ({ recipe, variant }: RecipeResultProps) => {
    const classes = useStyles()
    const { gridBreakpointProps } = useGridContext()

    if (!recipe) return <NotFound visible />

    return (
        <Grid container spacing={4} className={classes.recipeContainer}>
            <Grid item xs={12}>
                <RecipeResultHeader recipe={recipe} variant={variant} />
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            {variant !== 'preview' && (
                <Grid item xs={12}>
                    <RecipeResultAttachments recipeName={recipe.name} />
                </Grid>
            )}

            {recipe.ingredients.length > 0 && (
                <Grid {...gridBreakpointProps} item>
                    <StyledCard
                        header={
                            <>
                                Zutaten für {recipe.amount}{' '}
                                {recipe.amount < 2 ? 'Person' : 'Personen'}
                            </>
                        }
                        BackgroundIcon={AssignmentIcon}>
                        <MarkdownRenderer recipeName={recipe.name} source={recipe.ingredients} />
                    </StyledCard>
                </Grid>
            )}

            {recipe.description.length > 0 && (
                <Grid {...gridBreakpointProps} item>
                    <StyledCard header="Beschreibung" BackgroundIcon={BookIcon}>
                        <MarkdownRenderer recipeName={recipe.name} source={recipe.description} />
                    </StyledCard>
                </Grid>
            )}

            {recipe.relatedRecipes.length > 0 && (
                <Grid {...gridBreakpointProps} item>
                    <StyledCard header="Passt gut zu" BackgroundIcon={LabelIcon}>
                        <RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />
                    </StyledCard>
                </Grid>
            )}

            {variant !== 'preview' && (
                <Grid xs={12} item>
                    <Satisfaction recipeName={recipe.name} />
                </Grid>
            )}

            <Grid item xs={12} container justify="center">
                <AccountChip variant="readonly" uid={recipe.editorUid} />
            </Grid>
        </Grid>
    )
}

export default memo(
    RecipeResult,
    (prev, next) =>
        prev.recipe === next.recipe &&
        prev.variant === next.variant &&
        prev.divider === next.divider
)
