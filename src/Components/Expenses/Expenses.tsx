import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect, useState } from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Expense } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import useCurrentExpenseStore from '../../store/CurrentExpenseStore'
import useExpenseStore, {
    EXPENSE_COLLECTION,
    ExpenseStore,
    USER_COLLECTION,
} from '../../store/ExpenseStore'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
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

const Expenses = () => {
    const classes = useStyles()

    const [loading, setLoading] = useState(false)
    const [expensesByMonth, setExpensesByMonth] = useState(new Map<string, Expense[]>())
    const { expenses, isDialogOpen } = useExpenseStore(selector)
    const { openDialog } = useExpenseStore(dispatchSelector)
    const setExpenses = useExpenseStore(store => store.setExpenses)
    const setAutocompleteOptions = useExpenseStore(store => store.setAutocompleteOptions)
    const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
    const authContext = useFirebaseAuthContext()
    const resetCurrentExpense = useCurrentExpenseStore(store => store.clearState)

    useDocumentTitle('Ausgaben')

    useEffect(() => {
        if (!authContext.user) return

        setLoading(true)
        return FirebaseService.firestore
            .collection(USER_COLLECTION)
            .doc(authContext.user.uid)
            .collection(EXPENSE_COLLECTION)
            .orderBy('date', 'desc')
            .onSnapshot(snapshot => {
                const newExpenses = snapshot.docs.map(
                    document => ({ ...document.data(), id: document.id } as Expense)
                )
                const months = Array.from(
                    new Set(
                        newExpenses.map(e => expenseUtils.getMonthStringByDate(e.date.toDate()))
                    )
                )
                setExpenses(newExpenses)
                months.forEach(month =>
                    setExpensesByMonth(value =>
                        value.set(
                            month,
                            newExpenses.filter(
                                e => expenseUtils.getMonthStringByDate(e.date.toDate()) === month
                            )
                        )
                    )
                )
                setAutocompleteOptions({
                    creator: Array.from(
                        new Set([
                            ...newExpenses.filter(e => e.creator).map(e => e.creator),
                            ...newExpenses.map(e => e.relatedUsers).flat(),
                        ])
                    ).sort(),
                    shop: Array.from(
                        new Set(newExpenses.filter(e => e.shop).map(e => e.shop))
                    ).sort(),
                    category: Array.from(
                        new Set(newExpenses.filter(e => e.category).map(e => e.category))
                    ).sort(),
                    description: Array.from(
                        new Set(
                            newExpenses.filter(e => e.description).map(e => e.description ?? '')
                        )
                    ).sort(),
                })
                setLoading(false)
            })
    }, [authContext.user, setExpenses, setAutocompleteOptions])

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

            {expensesByMonth.size > 0 &&
                Array.from(expensesByMonth.entries()).map(([month, expenses]) => (
                    <ExpensesByMonth key={month} expenses={expenses} month={month} />
                ))}

            <NotFound visible={!loading && expenses.length === 0} />

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
