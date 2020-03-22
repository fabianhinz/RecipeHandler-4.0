import AssignmentIcon from '@material-ui/icons/Assignment'
import React from 'react'

import MarkdownInput from '../../Markdown/MarkdownInput'
import StyledCard from '../../Shared/StyledCard'
import RecipeCreateChangeAmount from './RecipeCreateChangeAmount'
import { RecipeCreateDispatch } from './RecipeCreateReducer'

interface Props extends RecipeCreateDispatch {
    amount: number
    ingredients: string
    onIngredientsChange: (value: string) => void
}

const RecipeCreateIngredients = ({ amount, ingredients, onIngredientsChange, dispatch }: Props) => {
    return (
        <StyledCard
            header={<RecipeCreateChangeAmount amount={amount} dispatch={dispatch} />}
            BackgroundIcon={AssignmentIcon}>
            <MarkdownInput outerValue={ingredients} onChange={onIngredientsChange} />
        </StyledCard>
    )
}

export default RecipeCreateIngredients
