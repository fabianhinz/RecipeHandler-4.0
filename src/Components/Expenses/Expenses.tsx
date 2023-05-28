import { TableChart, Timeline, VerticalSplit } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import {
  AppBar,
  Box,
  Grid,
  Hidden,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import makeStyles from '@mui/styles/makeStyles'
import withStyles from '@mui/styles/withStyles'
import { useLayoutEffect, useMemo, useState } from 'react'

import { SecouredRouteFab } from '@/Components/Routes/SecouredRouteFab'
import EntryGridContainer from '@/Components/Shared/EntryGridContainer'
import NotFound from '@/Components/Shared/NotFound'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { Nullable } from '@/model/model'
import useCurrentExpenseStore from '@/store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '@/store/ExpenseStore'
import { BORDER_RADIUS } from '@/theme'

import ArchivedExpensesSelection from './ArchivedExpensesSelection'
import ExpenseDialog from './ExpenseDialog'
import ExpensesByMonth from './ExpensesByMonth'
import { ExpensesChart } from './ExpensesChart'
import { ExpensesSplitView } from './ExpensesSplitView'
import ExpenseUserCard from './ExpenseUserCard'
import expenseUtils from './helper/expenseUtils'

const selector = (state: ExpenseStore) => ({
  expenses: state.expenses,
  isDialogOpen: state.isDialogOpen,
})

const useStyles = makeStyles(theme => ({
  container: {
    overflowX: 'auto',
  },
  header: {
    borderRadius: BORDER_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabWrapper: {
    fontSize: theme.typography.h5.fontSize,
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  totalSumContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
    margin: theme.spacing(2),
    padding: theme.spacing(0.5, 1),
    color: theme.palette.text.secondary,
  },
}))

export type ViewVariant = 'table' | 'graph' | 'split'

const StyledTab = withStyles(theme => ({
  wrapper: {
    fontSize: theme.typography.h6.fontSize,
  },
}))(Tab)

const Expenses = () => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'))
  const [view, setView] = useState<ViewVariant>('table')
  const [tabIndex, setTabIndex] = useState<number>(0)

  useLayoutEffect(() => {
    setView(lgUp ? 'split' : 'table')
  }, [lgUp])

  const classes = useStyles()

  const { expenses, isDialogOpen } = useExpenseStore(selector)
  const setIsDialogOpen = useExpenseStore(store => store.setIsDialogOpen)
  const rawExpensesByMonth = useExpenseStore(store => store.expensesByMonth)
  const expenseStoreLoading = useExpenseStore(store => store.loading)
  const autocompleteOptions = useExpenseStore(
    store => store.autocompleteOptions
  )
  const resetCurrentExpense = useCurrentExpenseStore(store => store.clearState)
  const years = useExpenseStore(store => store.years)
  const expenseFilter = useExpenseStore(store => store.expenseFilter)

  useLayoutEffect(() => {
    if (years.length > 0) {
      // TODO this index should be part of the store
      setTabIndex(years.length - 1)
    }
  }, [years.length])

  useLayoutEffect(() => {
    return useExpenseStore.subscribe(state => {
      if (state.hasActiveFilter) {
        setTabIndex(years.length)
      }
    })
  }, [years.length])

  useDocumentTitle('Ausgaben')

  const expensesFilteredMemoized = useMemo(() => {
    if (!expenseFilter && tabIndex === years.length) {
      return Array.from(rawExpensesByMonth.entries())
    }

    let byYear: Nullable<ReturnType<typeof expenseUtils.getExpensesByYear>> =
      null
    if (tabIndex !== undefined && years[tabIndex] !== undefined) {
      byYear = expenseUtils.getExpensesByYear(
        rawExpensesByMonth,
        years[tabIndex]
      )
    }
    return expenseUtils.getFilteredExpensesByMonth(
      byYear ? new Map(byYear) : rawExpensesByMonth,
      expenseFilter
    )
  }, [rawExpensesByMonth, expenseFilter, tabIndex, years])

  const expensesFlattened = useMemo(() => {
    return expensesFilteredMemoized.flatMap(([_, expenses]) => expenses)
  }, [expensesFilteredMemoized])

  const maxAmount = useMemo(() => {
    const amounts: number[] = []
    for (const [, expenses] of expensesFilteredMemoized) {
      amounts.push(expenses.reduce((acc, curr) => (acc += curr.amount), 0))
    }
    return amounts.sort((a, b) => b - a)[0] ?? 0
  }, [expensesFilteredMemoized])

  const memoizedTable = useMemo(() => {
    if (expensesFilteredMemoized.length === 0) {
      return
    }

    const sum = expensesFlattened.reduce((acc, curr) => (acc += curr.amount), 0)

    // check for length to avoid jumpy chart animation
    return (
      <>
        {expensesFilteredMemoized.map(([month, expenses]) => (
          <ExpensesByMonth key={month} expenses={expenses} month={month} />
        ))}
        <Paper className={classes.totalSumContainer}>
          <Typography>Total: {expenseUtils.formatAmount(sum)}</Typography>
        </Paper>
      </>
    )
  }, [classes.totalSumContainer, expensesFlattened, expensesFilteredMemoized])

  const memoizedGraph = useMemo(() => {
    return (
      <ExpensesChart
        enableFixedOnScroll={view === 'split'}
        maxAmount={maxAmount}
        expensesByMonth={expensesFilteredMemoized}
      />
    )
  }, [expensesFilteredMemoized, maxAmount, view])

  return (
    <EntryGridContainer
      header={
        <AppBar className={classes.header} position="static" color="default">
          <Toolbar className={classes.toolbar}>
            <Tabs
              scrollButtons
              variant="scrollable"
              value={tabIndex}
              onChange={(_, newIndex) => setTabIndex(newIndex)}
              allowScrollButtonsMobile>
              {years.map(year => (
                <StyledTab label={year} key={year} />
              ))}
              <StyledTab label="Gesamt" />
            </Tabs>
          </Toolbar>
        </AppBar>
      }>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box
            display="flex"
            alignItems="center"
            flexGrow={xsDown ? 1 : 0}
            justifyContent="space-between">
            <Typography variant="h4">Ausgaben</Typography>
            <Box ml={1}>
              <ToggleButtonGroup
                size="small"
                value={view}
                exclusive
                onChange={(_, newAlignment) => {
                  if (newAlignment) {
                    setView(newAlignment)
                  }
                }}
                aria-label="text alignment">
                <ToggleButton value="table">
                  <TableChart />
                </ToggleButton>
                <ToggleButton value="graph">
                  <Timeline />
                </ToggleButton>
                <ToggleButton disabled={!lgUp} value="split">
                  <VerticalSplit />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Hidden smDown>
            <Box flexGrow={0}>
              <ArchivedExpensesSelection />
            </Box>
          </Hidden>
        </Box>
      </Grid>

      {autocompleteOptions.creator.length > 0 && tabIndex !== undefined && (
        <Grid item xs={12}>
          <Grid
            container
            wrap="nowrap"
            className={classes.container}
            spacing={3}>
            {autocompleteOptions.creator.map(u => (
              <ExpenseUserCard
                expenses={expensesFlattened}
                year={years[tabIndex]}
                key={u}
                userName={u}
              />
            ))}
          </Grid>
        </Grid>
      )}

      {expenses.length > 0 && (
        <Grid item xs={12}>
          {view === 'table' && memoizedTable}
          {view === 'graph' && memoizedGraph}

          {view === 'split' && (
            <ExpensesSplitView>
              <div>{memoizedTable}</div>
              {memoizedGraph}
            </ExpensesSplitView>
          )}
        </Grid>
      )}

      <NotFound visible={!expenseStoreLoading && expenses.length === 0} />

      <SecouredRouteFab
        onClick={() => {
          resetCurrentExpense()
          setIsDialogOpen(true)
        }}
        tooltipTitle="Ausgabe hinzufügen"
        icon={<AddIcon />}
      />
      <ExpenseDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </EntryGridContainer>
  )
}

export default Expenses
