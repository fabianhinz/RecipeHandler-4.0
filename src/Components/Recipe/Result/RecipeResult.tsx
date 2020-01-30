import { createStyles, Divider, Grid, makeStyles } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import LabelIcon from '@material-ui/icons/LabelTwoTone'
import React, { memo } from 'react'

import useCardBreakpoints from '../../../hooks/useCardBreakpoints'
import { AttachmentData, AttachmentMetadata, Recipe } from '../../../model/model'
import AccountChip from '../../Account/AccountChip'
import MarkdownRenderer from '../../Markdown/MarkdownRenderer'
import Satisfaction from '../../Satisfaction/Satisfaction'
import NotFound from '../../Shared/NotFound'
import { Subtitle } from '../../Shared/Subtitle'
import RecipeCard from '../RecipeCard'
import { RecipeVariants } from './Action/RecipeResultAction'
import RecipeResultAttachments from './RecipeResultAttachments'
import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeVariants {
    recipe: Recipe<AttachmentMetadata | AttachmentData> | null
    divider?: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        recipeContainer: {
            overflowX: 'hidden',
        },
    })
)

const RecipeResult = ({ recipe, variant, divider }: RecipeResultProps) => {
    const classes = useStyles()

    const { breakpoints } = useCardBreakpoints({
        xsOnly: variant === 'pinned',
        xlEnabled: recipe !== null && recipe.relatedRecipes.length !== 0,
    })

    if (!recipe) return <NotFound visible />

    return (
        <Grid container spacing={variant === 'pinned' ? 2 : 4} className={classes.recipeContainer}>
            <Grid item xs={12}>
                <RecipeResultHeader recipe={recipe} variant={variant} />
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            {variant !== 'pinned' && recipe.attachments.length !== 0 && (
                <Grid item xs={12}>
                    <RecipeResultAttachments attachments={recipe.attachments} />
                </Grid>
            )}

            {recipe.ingredients.length > 0 && (
                <Grid {...breakpoints} item>
                    <RecipeCard
                        transitionOrder={1}
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
                        content={
                            <MarkdownRenderer
                                recipeName={recipe.name}
                                source={recipe.ingredients}
                            />
                        }
                    />
                </Grid>
            )}

            {recipe.description.length > 0 && (
                <Grid {...breakpoints} item>
                    <RecipeCard
                        transitionOrder={2}
                        variant={variant}
                        header={<Subtitle icon={<BookIcon />} text="Beschreibung" />}
                        content={
                            <MarkdownRenderer
                                recipeName={recipe.name}
                                source={recipe.description}
                            />
                        }
                    />
                </Grid>
            )}

            {recipe.relatedRecipes.length > 0 && variant !== 'pinned' && (
                <Grid {...breakpoints} item>
                    <RecipeCard
                        transitionOrder={3}
                        variant={variant}
                        header={<Subtitle icon={<LabelIcon />} text="Passt gut zu" />}
                        content={<RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />}
                    />
                </Grid>
            )}

            {variant !== 'preview' && variant !== 'pinned' && (
                <Grid xs={12} item>
                    <Satisfaction recipeName={recipe.name} transitionOrder={4} />
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
