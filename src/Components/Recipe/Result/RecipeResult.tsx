import { Grid } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/AssignmentTwoTone'
import BookIcon from '@material-ui/icons/BookTwoTone'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import React, { memo } from 'react'

import { Recipe, RecipeVariants } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import AccountChip from '../../Account/AccountChip'
import Attachments from '../../Attachments/Attachments'
import MarkdownRenderer from '../../Markdown/MarkdownRenderer'
import { useGridContext } from '../../Provider/GridProvider'
import Satisfaction from '../../Satisfaction/Satisfaction'
import EntryGridContainer from '../../Shared/EntryGridContainer'
import NotFound from '../../Shared/NotFound'
import StyledCard from '../../Shared/StyledCard'
import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps extends RecipeVariants {
    recipe: Recipe | null
    divider?: boolean
}

const RecipeResult = ({ recipe, variant }: RecipeResultProps) => {
    const { gridBreakpointProps } = useGridContext()

    if (!recipe) return <NotFound visible />

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <RecipeResultHeader recipe={recipe} variant={variant} />
            </Grid>

            {variant !== 'preview' && (
                <Grid item xs={12}>
                    <Attachments recipeName={recipe.name} />
                </Grid>
            )}

            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid {...gridBreakpointProps} item>
                        <StyledCard
                            header={
                                <>
                                    Zutaten für {recipe.amount}{' '}
                                    {recipe.amount < 2 ? 'Person' : 'Personen'}
                                </>
                            }
                            BackgroundIcon={AssignmentIcon}>
                            <MarkdownRenderer
                                recipeName={recipe.name}
                                source={recipe.ingredients}
                            />
                        </StyledCard>
                    </Grid>

                    <Grid {...gridBreakpointProps} item>
                        <StyledCard header="Beschreibung" BackgroundIcon={BookIcon}>
                            <MarkdownRenderer
                                recipeName={recipe.name}
                                source={recipe.description}
                            />
                        </StyledCard>
                    </Grid>

                    {recipe.relatedRecipes.length > 0 && (
                        <Grid {...gridBreakpointProps} item>
                            <StyledCard header="Passt gut zu" BackgroundIcon={SwapIcon}>
                                <RecipeResultRelated relatedRecipes={recipe.relatedRecipes} />
                            </StyledCard>
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {variant !== 'preview' && (
                <Grid xs={12} item>
                    <Satisfaction recipeName={recipe.name} />
                </Grid>
            )}

            <Grid item xs={12} container justify="center">
                <AccountChip
                    variant="outlined"
                    uid={recipe.editorUid}
                    enhanceLabel={`am ${FirebaseService.createDateFromTimestamp(
                        recipe.createdDate
                    ).toLocaleDateString()}`}
                />
            </Grid>
        </EntryGridContainer>
    )
}

export default memo(
    RecipeResult,
    (prev, next) =>
        prev.recipe === next.recipe &&
        prev.variant === next.variant &&
        prev.divider === next.divider
)
