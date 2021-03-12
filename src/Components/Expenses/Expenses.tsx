import { Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useState } from 'react'

import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import useExpenseStore, { ExpenseState } from '../State/ExpenseState'
import ExpenseCard from './ExpenseCard'
import NewExpenseDialog from './NewExpenseDialog'
import UserCard from './UserCard'

const selector = (state: ExpenseState) => ({
    user: state.user,
    expenses: state.expenses,
})

const Expenses = () => {
    const { user, expenses } = useExpenseStore(selector)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const closeDialog = () => setDialogOpen(false)

    return (
        <EntryGridContainer>
            {user.length > 0 && (
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {user.map(u => (
                            <UserCard key={u} userName={u} />
                        ))}
                    </Grid>
                </Grid>
            )}
            {expenses.length > 0 && (
                <Grid item xs={12}>
                    <Grid container direction="column" spacing={1}>
                        {expenses.map(e => (
                            <ExpenseCard expense={e} />
                        ))}
                    </Grid>
                </Grid>
            )}
            <SecouredRouteFab
                onClick={() => setDialogOpen(true)}
                tooltipTitle="Ausgabe hinzufügen"
                icon={<AddIcon />}
            />
            <NewExpenseDialog open={dialogOpen} onClose={closeDialog} />
        </EntryGridContainer>
    )
}

export default Expenses
