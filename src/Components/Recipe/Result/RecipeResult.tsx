import { Divider, Grid } from '@material-ui/core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import BookIcon from '@material-ui/icons/Book'
import SwapIcon from '@material-ui/icons/SwapHorizontalCircle'
import React, { memo } from 'react'

import { Recipe } from '../../../model/model'
import { FirebaseService } from '../../../services/firebase'
import AccountChip from '../../Account/AccountChip'
import Attachments from '../../Attachments/Attachments'
import MarkdownRenderer from '../../Markdown/MarkdownRenderer'
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

    if (!recipe) return <NotFound visible />

    const calculateAmountText = () => {
        switch (recipe.amount) {
            case 21: {
                return 'eine kleine Form'
            }
            case 22: {
                return 'eine große Form'
            }
            case 23: {
                return 'ein Blech'
            }
            case 1: {
                return '1 Person'
            }
            default: {
                if (recipe.amount > 30) return `${recipe.amount - 30} Stück`
                else return `${recipe.amount} Personen`
            }
        }
    }

    return (
        <EntryGridContainer>
            <Grid item xs={12}>
                <RecipeResultHeader recipe={recipe} />
            </Grid>

            <Attachments recipeName={recipe.name} />

            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid {...gridBreakpointProps} item>
                        <StyledCard
                            header={<>Zutaten für {calculateAmountText()}</>}
                            action={<CopyButton text={recipe.ingredients} />}
                            BackgroundIcon={AssignmentIcon}>
                            <MarkdownRenderer
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

                    <Grid {...gridBreakpointProps} item>
                        <Satisfaction recipeName={recipe.name} />
                    </Grid>
                </Grid>
            </Grid>

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
    (prev, next) => prev.recipe === next.recipe && prev.divider === next.divider
)
