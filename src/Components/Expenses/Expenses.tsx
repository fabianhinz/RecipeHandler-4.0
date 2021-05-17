import { Box, Grid, Typography } from '@material-ui/core'
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
import ExpenseCard from './ExpenseCard'
import ExpenseDialog from './ExpenseDialog'
import ExpenseUserCard from './ExpenseUserCard'

const selector = (state: ExpenseStore) => ({
    expenses: state.expenses,
    isDialogOpen: state.isNewExpenseDialogOpen,
})

const dispatchSelector = (state: ExpenseStore) => ({
    openDialog: state.openNewExpenseDialog,
})

const Expenses = () => {
    const [loading, setLoading] = useState(false)
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
                setExpenses(newExpenses)
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
                    <Grid container spacing={3}>
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

            {expenses.length > 0 && (
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {expenses.map((e, i) => (
                            <ExpenseCard key={i} expense={e} />
                        ))}
                    </Grid>
                </Grid>
            )}

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
