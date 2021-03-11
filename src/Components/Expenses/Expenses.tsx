import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React from 'react'

import { FirebaseService } from '../../services/firebase'
import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import ExpenseCard from './ExpenseCard'
import UserCard from './UserCard'

// MockData, will be removed when using Firestore
const user = ['Fabi', 'Miri', 'Hans']
const expenses: Expense[] = [
    {
        creator: 'Fabi',
        amount: 256.54,
        shop: 'DM',
        category: 'Lebensmittel',
        subCategory: 'Einkauf',
        date: FirebaseService.createTimestampFromDate(new Date()),
        relatedUsers: ['Fabi', 'Miri', 'Hans'],
    },
    {
        creator: 'Miri',
        amount: 150.54,
        shop: 'Edeka',
        category: 'Lebensmittel',
        subCategory: 'Einkauf',
        date: FirebaseService.createTimestampFromDate(new Date()),
        relatedUsers: ['Fabi', 'Miri'],
    },
]

export interface Expense {
    creator: string
    amount: number
    shop: string
    category: string
    subCategory?: string
    date: firebase.firestore.Timestamp
    relatedUsers: string[]
}

const Expenses = () => {
    return (
        <EntryGridContainer>
            {user.length > 0 && (
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {user.map(u => (
                            <UserCard key={u} userName={u} expenses={expenses} />
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
                onClick={() => console.info('Add expense')}
                tooltipTitle="Ausgabe hinzufügen"
                icon={<AddIcon />}
            />
        </EntryGridContainer>
    )
}

export default Expenses
