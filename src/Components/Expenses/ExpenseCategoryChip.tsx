import { Chip, ChipProps, Grid, makeStyles, Theme } from '@material-ui/core'
import { useMemo } from 'react'

import { Expense } from '@/model/model'

import expenseUtils, { formatAmount } from './helper/expenseUtils'

const useStyles = makeStyles<Theme, { backgroundColor?: string; color: string }>(theme => ({
  root: props => props,
  icon: props => props,
  clickable: {
    transition: theme.transitions.create('filter'),
    '&:hover': {
      backgroundColor: props => props.backgroundColor,
    },
    '&:focus': {
      backgroundColor: props => props.backgroundColor,
    },
  },
  deleteIcon: {
    color: props => theme.palette.getContrastText(props.backgroundColor ?? '#fff'),
    '&:hover': {
      color: props => theme.palette.getContrastText(props.backgroundColor ?? '#fff'),
    },
  },
}))

interface Props extends Pick<ChipProps, 'onClick' | 'onDelete' | 'icon'> {
  category: string
  expenses: string | Expense[]
}

const ExpenseCategoryChip = (props: Props) => {
  const { icon, ...palette } = expenseUtils.useExpenseCategoryPalette({
    category: props.category,
    variant: 'chip',
  })
  const classes = useStyles(palette)
  const amount = useMemo(() => {
    if (typeof props.expenses === 'string') {
      return props.expenses
    }

    return expenseUtils.getAmountByCategory(props.category, props.expenses)
  }, [props.category, props.expenses])

  return (
    <Grid item key={props.category}>
      <Chip
        onClick={props.onClick}
        disabled={amount === 0}
        onDelete={props.onDelete}
        icon={props.icon ?? icon}
        classes={classes}
        label={`${props.category}: ${formatAmount(amount)}`}
      />
    </Grid>
  )
}

export default ExpenseCategoryChip
