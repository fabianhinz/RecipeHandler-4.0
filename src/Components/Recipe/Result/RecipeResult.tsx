import { Grid } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import { memo } from 'react'

import AccountChip from '@/Components/Account/AccountChip'
import Attachments from '@/Components/Attachments/Attachments'
import MarkdownRenderer from '@/Components/Markdown/MarkdownRenderer'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import Satisfaction from '@/Components/Satisfaction/Satisfaction'
import CopyButton from '@/Components/Shared/CopyButton'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import NotFound from '@/Components/Shared/NotFound'
import StyledCard from '@/Components/Shared/StyledCard'
import { Recipe } from '@/model/model'
import { FirebaseService } from '@/services/firebase'
import { useLayoutStore } from '@/store/LayoutStore'

import RecipeResultHeader from './RecipeResultHeader'
import { RecipeResultRelated } from './RecipeResultRelated'

interface RecipeResultProps {
    recipe: Recipe | null
    divider?: boolean
}

const RecipeResult = ({ recipe }: RecipeResultProps) => {
    const { gridBreakpointProps } = useGridContext()
    const { user } = useFirebaseAuthContext()
    const gridListActive = useLayoutStore(store => store.gridListActive)

    if (!recipe) return <NotFound visible />

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <RecipeResultHeader recipe={recipe} />
            </Grid>

            {gridListActive ? (
                <>{user && <Attachments recipe={recipe} />}</>
            ) : (
                <>
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
                                    <MarkdownRenderer withShoppingList recipeName={recipe.name}>
                                        {recipe.ingredients}
                                    </MarkdownRenderer>
                                </StyledCard>
                            </Grid>

                            <Grid {...gridBreakpointProps} item>
                                <StyledCard
                                    header="Beschreibung"
                                    BackgroundIcon={BookIcon}
                                    action={<CopyButton text={recipe.description} />}>
                                    <MarkdownRenderer recipeName={recipe.name}>
                                        {recipe.description}
                                    </MarkdownRenderer>
                                </StyledCard>
                            </Grid>

                            {recipe.relatedRecipes.length > 0 && (
                                <Grid {...gridBreakpointProps} item>
                                    <StyledCard
                                        expandable
                                        header="Passt gut zu"
                                        BackgroundIcon={SwapIcon}>
                                        <RecipeResultRelated
                                            relatedRecipes={recipe.relatedRecipes}
                                        />
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
                        <Grid item xs={12} container justifyContent="center">
                            <AccountChip
                                variant="outlined"
                                uid={recipe.editorUid}
                                enhanceLabel={`am ${FirebaseService.createDateFromTimestamp(
                                    recipe.createdDate
                                ).toLocaleDateString()}`}
                            />
                        </Grid>
                    )}
                </>
            )}
        </EntryGridContainer>
    )
}

export default memo(
    RecipeResult,
    (prev, next) => prev.recipe === next.recipe && prev.divider === next.divider
)
