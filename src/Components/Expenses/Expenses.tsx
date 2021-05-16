import { Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect } from 'react'

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
    const { expenses, isDialogOpen } = useExpenseStore(selector)
    const { openDialog } = useExpenseStore(dispatchSelector)
    const setExpenses = useExpenseStore(store => store.setExpenses)
    const setAutocompleteOptions = useExpenseStore(store => store.setAutocompleteOptions)
    const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
    const authContext = useFirebaseAuthContext()
    const resetCurrentExpense = useCurrentExpenseStore(store => store.clearState)

    useEffect(() => {
        if (!authContext.user) return
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
            })
    }, [authContext.user, setExpenses, setAutocompleteOptions])

    return (
        <EntryGridContainer>
            {autocompleteOptions.creator.length > 0 && (
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        {autocompleteOptions.creator.map(u => (
                            <ExpenseUserCard key={u} userName={u} />
                        ))}
                    </Grid>
                </Grid>
            )}
            {expenses.length > 0 && (
                <Grid item xs={12}>
                    <Grid container direction="column" spacing={1}>
                        {expenses.map((e, i) => (
                            <ExpenseCard key={i} expense={e} />
                        ))}
                    </Grid>
                </Grid>
            )}
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
