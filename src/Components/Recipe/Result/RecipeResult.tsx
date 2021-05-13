import { Grid } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import React, { memo } from 'react'

import { Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import AccountChip from '../../Account/AccountChip'
import Attachments from '../../Attachments/Attachments'
import MarkdownRenderer from '../../Markdown/MarkdownRenderer'
import { useFirebaseAuthContext } from '../../Provider/FirebaseAuthProvider'
import { useGridContext } from '../../Provider/GridProvider'
import Satisfaction from '../../Satisfaction/Satisfaction'
import CopyButton from '../../Shared/CopyButton'
import EntryGridContainer from '../../Shared/EntryGridContainer'
import NotFound from '../../Shared/NotFound'
import StyledCard from '../../Shared/StyledCard'
import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps {
    recipe: Recipe | null
    divider?: boolean
}

const RecipeResult = ({ recipe }: RecipeResultProps) => {
    const { gridBreakpointProps } = useGridContext()
    const { user } = useFirebaseAuthContext()

    if (!recipe) return <NotFound visible />

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <RecipeResultHeader recipe={recipe} />
            </Grid>

            {user && <Attachments recipe={recipe} />}

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid {...gridBreakpointProps} item>
                        <StyledCard
                            header={
                                <>
                                    Zutaten für {recipe.amount}{' '}
                                    {recipe.amount < 2 ? 'Person' : 'Personen'}
                                </>
                            }
                            action={<CopyButton text={recipe.ingredients} />}
                            BackgroundIcon={AssignmentIcon}>
                            <MarkdownRenderer
                                withShoppingList
                                recipeName={recipe.name}
                                source={recipe.ingredients}
                            />
                        </StyledCard>
                    </Grid>

                    <Grid {...gridBreakpointProps} item>
                        <StyledCard
                            header="Beschreibung"
                            BackgroundIcon={BookIcon}
                            action={<CopyButton text={recipe.description} />}>
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

                    {user && (
                        <Grid {...gridBreakpointProps} item>
                            <Satisfaction recipeName={recipe.name} />
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {user && (
                <Grid item xs={12} container justify="center">
                    <AccountChip
                        variant="outlined"
                        uid={recipe.editorUid}
                        enhanceLabel={`am ${FirebaseService.createDateFromTimestamp(
                            recipe.createdDate
                        ).toLocaleDateString()}`}
                    />
                </Grid>
            )}
        </EntryGridContainer>
    )
}

export default memo(
    RecipeResult,
    (prev, next) => prev.recipe === next.recipe && prev.divider === next.divider
)
