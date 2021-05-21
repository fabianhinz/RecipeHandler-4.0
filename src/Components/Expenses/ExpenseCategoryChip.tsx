import { Chip, Grid, makeStyles, Theme } from '@material-ui/core'

import { Expense } from '../../model/model'
import expenseUtils from './helper/expenseUtils'

const useChipStyles = makeStyles<Theme, { backgroundColor?: string; color: string }>({
    root: props => props,
    icon: props => props,
})

interface Props {
    category: string
    expenses: Expense[]
}

const ExpenseCategoryChip = (props: Props) => {
    const { icon, ...palette } = expenseUtils.useExpenseCategoryPalette({
        category: props.category,
        variant: 'chip',
    })
    const chipClasses = useChipStyles(palette)

    return (
        <Grid item key={props.category}>
            <Chip
                classes={chipClasses}
                icon={icon}
                label={`${props.category}: ${expenseUtils.getAmountByCategory(
                    props.category,
                    props.expenses,
                    true
                )}`}
            />
        </Grid>
    )
}

export default ExpenseCategoryChip
