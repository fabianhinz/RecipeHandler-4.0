import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Theme,
  Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { ChevronRight } from 'mdi-material-ui'
import { useMemo, useState } from 'react'

import { Expense } from '@/model/model'
import useExpenseStore from '@/store/ExpenseStore'

import ExpenseCard from './ExpenseCard'
import ExpenseCategoryChip from './ExpenseCategoryChip'

interface StyleProps {
  expanded: boolean
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  expandBtn: {
    fontSize: theme.typography.subtitle1.fontSize,
  },
  chevron: {
    transition: theme.transitions.create('transform'),
    transform: props => `rotate(${props.expanded ? 90 : 0}deg)`,
  },
  chipContainer: {
    overflowX: 'auto',
  },
}))

interface Props {
  month: string
  expenses: Expense[]
}

const ExpensesByMonth = (props: Props) => {
  const [expanded, setExpanded] = useState<StyleProps['expanded']>(false)
  const classes = useStyles({ expanded })
  const categories = useExpenseStore(store => store.categories)
  const hasActiveFilter = useExpenseStore(store => store.hasActiveFilter)

  const amountMemoized = useMemo(() => {
    return props.expenses
      .map(e => e.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [props.expenses])

  if (hasActiveFilter && amountMemoized === 0) {
    return null
  }

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Button
          startIcon={<ChevronRight className={classes.chevron} />}
          className={classes.expandBtn}
          variant="text"
          onClick={() => setExpanded(value => !value)}>
          {props.month}
        </Button>

        <Typography>
          Summe:{' '}
          {amountMemoized.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
          })}
        </Typography>
      </Box>
      <Divider variant="middle" />
      <Collapse mountOnEnter unmountOnExit in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} />
          <Grid item xs={12}>
            <Grid
              container
              wrap="nowrap"
              className={classes.chipContainer}
              spacing={1}>
              {categories.map(category => (
                <ExpenseCategoryChip
                  key={category}
                  category={category}
                  expenses={props.expenses}
                />
              ))}
            </Grid>
          </Grid>
          {props.expenses.map((e, i) => (
            <ExpenseCard key={i} expense={e} />
          ))}
          <Grid item xs={12} />
        </Grid>
      </Collapse>
    </>
  )
}

export default ExpensesByMonth
