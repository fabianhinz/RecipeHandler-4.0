import AssignmentIcon from '@material-ui/icons/Assignment'
import React from 'react'

import { Quantity } from '../../../model/model'
import MarkdownInput from '../../Markdown/MarkdownInput'
import StyledCard from '../../Shared/StyledCard'
import RecipeCreateChangeAmount from './RecipeCreateChangeAmount'
import { RecipeCreateDispatch } from './RecipeCreateReducer'

interface Props extends RecipeCreateDispatch {
    amount: number | undefined
    quantity: Quantity
    ingredients: string
    onIngredientsChange: (value: string) => void
}

const RecipeCreateIngredients = ({
    amount,
    quantity,
    ingredients,
    onIngredientsChange,
    dispatch,
}: Props) => {
    return (
        <StyledCard
            header={
                <RecipeCreateChangeAmount amount={amount} quantity={quantity} dispatch={dispatch} />
            }
            BackgroundIcon={AssignmentIcon}>
            <MarkdownInput outerValue={ingredients} onChange={onIngredientsChange} />
        </StyledCard>
    )
}

export default RecipeCreateIngredients
