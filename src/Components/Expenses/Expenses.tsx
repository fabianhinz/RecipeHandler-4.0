import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import { TableChart, Timeline } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { useMemo, useState } from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Expense } from '../../model/model'
import useCurrentExpenseStore from '../../store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import ArchivedExpensesSelection from './ArchivedExpensesSelection'
import ExpenseDialog from './ExpenseDialog'
import ExpensesByMonth from './ExpensesByMonth'
import { ExpensesChart } from './ExpensesChart'
import ExpenseUserCard from './ExpenseUserCard'
import expenseUtils from './helper/expenseUtils'
const selector = (state: ExpenseStore) => ({
    expenses: state.expenses,
    isDialogOpen: state.isNewExpenseDialogOpen,
})

const dispatchSelector = (state: ExpenseStore) => ({
    openDialog: state.openNewExpenseDialog,
})

const useStyles = makeStyles(theme => ({
    container: {
        overflowX: 'auto',
    },
}))

export type ExpenseFilter = Partial<Record<keyof Pick<Expense, 'creator' | 'category'>, string>>
export type ExpenseFilterChangeHandler = <Key extends keyof ExpenseFilter>(
    key: Key,
    value: ExpenseFilter[Key]
) => void

export type ViewVariant = 'table' | 'graph'

/**
 * # ToDo:
 * - [ ] Add a year filter for all expenses >> [2021, 2022, all]
 * - [x] filter between views should be propagated to each other
 * - [ ] split view on desktop?
 * - [ ] extenseable filter with autocomplete options
 */
const Expenses = () => {
    const [filter, setFilter] = useState<ExpenseFilter>({})
    const [view, setView] = useState<ViewVariant>('table')

    const classes = useStyles()

    const { expenses, isDialogOpen } = useExpenseStore(selector)
    const { openDialog } = useExpenseStore(dispatchSelector)
    const expensesByMonth = useExpenseStore(store => store.expensesByMonth)
    const expenseStoreLoading = useExpenseStore(store => store.loading)
    const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
    const resetCurrentExpense = useCurrentExpenseStore(store => store.clearState)

    useDocumentTitle('Ausgaben')

    const expensesToRenderMemoized = useMemo(() => {
        if (!filter) {
            return Array.from(expensesByMonth.entries())
        }
        return expenseUtils.getFilteredExpensesByMonth(expensesByMonth, filter)
    }, [expensesByMonth, filter])

    const handleFilterChange: ExpenseFilterChangeHandler = (key, value) => {
        const nextFilter = { ...filter }

        if (nextFilter[key] === value) {
            delete nextFilter[key]
        } else {
            nextFilter[key] = value
        }

        setFilter(nextFilter)
    }

    return (
        <EntryGridContainer>
            {autocompleteOptions.creator.length > 0 && (
                <Grid item xs={12}>
                    <Grid container wrap="nowrap" className={classes.container} spacing={3}>
                        {autocompleteOptions.creator.map(u => (
                            <ExpenseUserCard
                                filter={filter}
                                onFilterChange={handleFilterChange}
                                key={u}
                                userName={u}
                            />
                        ))}
                    </Grid>
                </Grid>
            )}

            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
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
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                    <Box flexGrow={0}>
                        <ArchivedExpensesSelection />
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12}>
                {/* check for length to avoid jumpy chart animation */}
                {view === 'table' &&
                    expensesToRenderMemoized.length > 0 &&
                    expensesToRenderMemoized.map(([month, expenses]) => (
                        <ExpensesByMonth
                            filter={filter}
                            onFilterChange={handleFilterChange}
                            key={month}
                            expenses={expenses}
                            month={month}
                        />
                    ))}

                {view === 'graph' && (
                    <ExpensesChart
                        filter={filter}
                        onFilterChange={handleFilterChange}
                        expensesByMonth={expensesToRenderMemoized}
                    />
                )}
            </Grid>

            <NotFound visible={!expenseStoreLoading && expenses.length === 0} />

            <SecouredRouteFab
                onClick={() => {
                    resetCurrentExpense()
                    openDialog(true)
                }}
                tooltipTitle="Ausgabe hinzufügen"
                icon={<AddIcon />}
            />
            <ExpenseDialog open={isDialogOpen} onClose={() => openDialog(false)} />
        </EntryGridContainer>
    )
}

export default Expenses
