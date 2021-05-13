import { Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useEffect } from 'react'

import { Expense } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import useCurrentExpenseState from '../../store/CurrentExpenseState'
import useExpenseStore, {
    expensesCollection,
    ExpenseState,
    userCollection,
} from '../../store/ExpenseState'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import ExpenseCard from './ExpenseCard'
import NewExpenseDialog from './NewExpenseDialog'
import UserCard from './UserCard'

const selector = (state: ExpenseState) => ({
    user: state.user,
    expenses: state.expenses,
    isDialogOpen: state.isNewExpenseDialogOpen,
})

const dispatchSelector = (state: ExpenseState) => ({
    openDialog: state.openNewExpenseDialog,
})

const Expenses = () => {
    const { user, expenses, isDialogOpen } = useExpenseStore(selector)
    const { openDialog } = useExpenseStore(dispatchSelector)
    const setExpenses = useExpenseStore(store => store.setExpenses)
    const authContext = useFirebaseAuthContext()
    const resetCurrentExpense = useCurrentExpenseState(store => store.clearState)

    useEffect(() => {
        if (!authContext.user) return
        return FirebaseService.firestore
            .collection(userCollection)
            .doc(authContext.user.uid)
            .collection(expensesCollection)
            .onSnapshot(snapshot => {
                setExpenses(
                    snapshot.docs.map(
                        document => ({ ...document.data(), id: document.id } as Expense)
                    )
                )
            })
    }, [authContext.user, setExpenses])

    return (
        <EntryGridContainer>
            {user.length > 0 && (
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        {user.map(u => (
                            <UserCard key={u} userName={u} />
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
            <NewExpenseDialog open={isDialogOpen} onClose={() => openDialog(false)} />
        </EntryGridContainer>
    )
}

export default Expenses
