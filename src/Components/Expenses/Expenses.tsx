import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useMemo, useState } from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Expense, Nullable } from '../../model/model'
import useCurrentExpenseStore from '../../store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import ArchivedExpensesSelection from './ArchivedExpensesSelection'
import ExpenseDialog from './ExpenseDialog'
import ExpensesByMonth from './ExpensesByMonth'
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

export interface ExpenseFiter {
    key: keyof Pick<Expense, 'creator'>
    value: string
}

const Expenses = () => {
    const [filter, setFilter] = useState<Nullable<ExpenseFiter>>(null)

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

    return (
        <EntryGridContainer>
            {autocompleteOptions.creator.length > 0 && (
                <Grid item xs={12}>
                    <Grid container wrap="nowrap" className={classes.container} spacing={3}>
                        {autocompleteOptions.creator.map(u => (
                            <ExpenseUserCard
                                filter={filter}
                                onFilterChange={setFilter}
                                key={u}
                                userName={u}
                            />
                        ))}
                    </Grid>
                </Grid>
            )}

            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Ausgaben</Typography>
                    <Box flexGrow={0}>
                        <ArchivedExpensesSelection />
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12}>
                {/* check for length to avoid jumpy chart animation */}
                {expensesToRenderMemoized.length > 0 &&
                    expensesToRenderMemoized.map(([month, expenses]) => (
                        <ExpensesByMonth key={month} expenses={expenses} month={month} />
                    ))}
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
