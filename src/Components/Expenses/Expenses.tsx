import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import useCurrentExpenseStore from '../../store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import ArchivedExpensesSelection from './ArchivedExpensesSelection'
import ExpenseDialog from './ExpenseDialog'
import ExpensesByMonth from './ExpensesByMonth'
import ExpenseUserCard from './ExpenseUserCard'

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

const Expenses = () => {
    const classes = useStyles()

    const { expenses, isDialogOpen } = useExpenseStore(selector)
    const { openDialog } = useExpenseStore(dispatchSelector)
    const expensesByMonth = useExpenseStore(store => store.expensesByMonth)
    const expenseStoreLoading = useExpenseStore(store => store.loading)
    const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
    const resetCurrentExpense = useCurrentExpenseStore(store => store.clearState)

    useDocumentTitle('Ausgaben')

    return (
        <EntryGridContainer>
            {autocompleteOptions.creator.length > 0 && (
                <Grid item xs={12}>
                    <Grid container wrap="nowrap" className={classes.container} spacing={3}>
                        {autocompleteOptions.creator.map(u => (
                            <ExpenseUserCard key={u} userName={u} />
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
                {expensesByMonth.size > 0 &&
                    Array.from(expensesByMonth.entries()).map(([month, expenses]) => (
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
