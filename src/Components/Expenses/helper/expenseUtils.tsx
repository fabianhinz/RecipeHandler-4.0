import { makeStyles, Theme } from '@material-ui/core'
import { amber, blue, blueGrey, deepPurple, green, pink } from '@material-ui/core/colors'
import { AttachMoney, FlightTakeoff } from '@material-ui/icons'
import Commute from '@material-ui/icons/Commute'
import Fastfood from '@material-ui/icons/Fastfood'
import Weekend from '@material-ui/icons/Weekend'
import { CashMultiple } from 'mdi-material-ui'

import { Expense } from '@/model/model'
import { ExpenseState } from '@/store/ExpenseStore'

import { ExpenseFilter } from '../Expenses'

type CategoryPaletteProps = { category: string; variant: 'chip' | 'card' }

export const CATEGORIES_PALETTE: { [key: string]: string | undefined } = {
  Lebensmittel: amber.A100,
  Mobilität: pink.A100,
  Inventar: deepPurple.A100,
  Sonstiges: blueGrey.A100,
  Urlaub: blue.A100,
}

const useStyles = makeStyles<Theme, CategoryPaletteProps>(() => ({
  icon: props => ({
    color: props.variant === 'card' ? CATEGORIES_PALETTE[props.category] : '#fff',
  }),
}))

const useExpenseCategoryPalette = (props: CategoryPaletteProps) => {
  const classes = useStyles(props)
  const fontSize = props.variant === 'chip' ? 'small' : 'large'
  const palette = { backgroundColor: CATEGORIES_PALETTE[props.category], color: '#000' }

  switch (props.category) {
    case 'Lebensmittel':
      return {
        ...palette,
        icon: <Fastfood className={classes.icon} fontSize={fontSize} />,
      }
    case 'Mobilität':
      return {
        ...palette,
        icon: <Commute className={classes.icon} fontSize={fontSize} />,
      }
    case 'Inventar':
      return {
        ...palette,
        icon: <Weekend className={classes.icon} fontSize={fontSize} />,
      }
    case 'Sonstiges':
      return {
        ...palette,
        icon: <CashMultiple className={classes.icon} fontSize={fontSize} />,
      }
    case 'Urlaub':
      return {
        ...palette,
        icon: <FlightTakeoff className={classes.icon} fontSize={fontSize} />,
      }
    default:
      return {
        ...palette,
        backgroundColor: green.A100,
        icon: <AttachMoney className={classes.icon} fontSize={fontSize} />,
      }
  }
}

const dayFormatter = new Intl.DateTimeFormat('de', {
  day: 'numeric',
  weekday: 'long',
  month: 'short',
})
const getFormattedDateString = (date: Date) => {
  return dayFormatter.format(date)
}

const monthFormatter = new Intl.DateTimeFormat('de', { month: 'long', year: 'numeric' })
const getMonthStringByDate = (date: Date) => {
  return monthFormatter.format(date)
}

const numberFormatter = new Intl.NumberFormat('de')
const expenseFormatter = new Intl.NumberFormat('de', { style: 'currency', currency: 'EUR' })

const formatAmount = (amount: number) =>
  amount.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })
// we should only need one getAmount*** function
const getAmountByCategory = (category: string, expenses: Expense[], format?: boolean) => {
  const amount = expenses
    .filter(e => e.category === category)
    .reduce((acc, curr) => (acc += curr.amount), 0)

  return format ? formatAmount(amount) : amount
}

function getAmountByExpenseKey<Key extends keyof Expense>(
  key: Key,
  value: Expense[Key],
  expenses: Expense[]
) {
  const amount = expenses
    .filter(e => e[key] === value)
    .reduce((acc, curr) => (acc += curr.amount), 0)

  return amount
}

const getExpensesByYear = (expensesByMonth: ExpenseState['expensesByMonth'], year: number) => {
  const filteredExpenses: ExpenseState['expensesByMonth'] = new Map()

  for (const [month, expenses] of expensesByMonth.entries()) {
    // 😜
    if (month.includes(year.toString())) {
      filteredExpenses.set(month, expenses)
    }
  }

  return Array.from(filteredExpenses.entries())
}

const getFilteredExpensesByMonth = (
  expensesByMonth: ExpenseState['expensesByMonth'],
  filter: ExpenseFilter
) => {
  const filteredExpenses: ExpenseState['expensesByMonth'] = new Map()

  for (const [month, expenses] of expensesByMonth.entries()) {
    const expensesFiltered = expenses.filter(expense => {
      return Object.entries(filter)
        .map(([key, value]) => {
          return expense[key] === value
        })
        .every(Boolean)
    })

    filteredExpenses.set(month, expensesFiltered)
  }

  return Array.from(filteredExpenses.entries())
}

const expenseUtils = {
  getMonthStringByDate,
  getFormattedDateString,
  getAmountByCategory,
  getAmountByExpenseKey,
  formatAmount,
  useExpenseCategoryPalette,
  getFilteredExpensesByMonth,
  getExpensesByYear,
  numberFormatter,
  expenseFormatter,
}
export default expenseUtils
