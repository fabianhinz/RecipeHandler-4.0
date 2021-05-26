import { Chip, Grid, makeStyles, Theme } from '@material-ui/core'
import { useMemo } from 'react'

import { Expense } from '../../model/model'
import expenseUtils from './helper/expenseUtils'

const useStyles = makeStyles<Theme, { backgroundColor?: string; color: string }>({
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
    const classes = useStyles(palette)
    const amount = useMemo(
        () => expenseUtils.getAmountByCategory(props.category, props.expenses, true),
        [props.category, props.expenses]
    )

    return (
        <Grid item key={props.category}>
            <Chip classes={classes} icon={icon} label={`${props.category}: ${amount}`} />
        </Grid>
    )
}

export default ExpenseCategoryChip
