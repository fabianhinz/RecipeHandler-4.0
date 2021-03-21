import { Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React from 'react'

import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import useExpenseStore, { ExpenseState } from '../State/ExpenseState'
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
                            <ExpenseCard key={i} expense={e} id={i} />
                        ))}
                    </Grid>
                </Grid>
            )}
            <SecouredRouteFab
                onClick={() => openDialog(true)}
                tooltipTitle="Ausgabe hinzufügen"
                icon={<AddIcon />}
            />
            <NewExpenseDialog open={isDialogOpen} onClose={() => openDialog(false)} />
        </EntryGridContainer>
    )
}

export default Expenses
