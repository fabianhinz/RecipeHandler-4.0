import create from 'zustand'

import { Expense } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

// MockData, will be removed when using Firestore
const user = ['Fabi', 'Miri', 'Hans']
const expenses: Expense[] = [
    {
        creator: 'Fabi',
        amount: 256.54,
        shop: 'DM',
        category: 'Lebensmittel',
        description: 'Einkauf',
        date: FirebaseService.createTimestampFromDate(new Date()),
        relatedUsers: ['Fabi', 'Miri', 'Hans'],
    },
    {
        creator: 'Miri',
        amount: 150.54,
        shop: 'Edeka',
        category: 'Lebensmittel',
        description: 'Einkauf',
        date: FirebaseService.createTimestampFromDate(new Date()),
        relatedUsers: ['Fabi', 'Miri'],
    },
    {
        creator: 'Miri',
        amount: 98.35,
        shop: 'Hornbach',
        category: 'Sonstiges',
        description: 'Streichen',
        date: FirebaseService.createTimestampFromDate(new Date()),
        relatedUsers: ['Fabi', 'Miri'],
    },
]
const categories = ['Lebensmittel', 'Mobilität', 'Inventar', 'Sonstiges']

export type ExpenseState = {
    expenses: Expense[]
    user: string[]
    categories: string[]
    setExpenses: (expenses: Expense[]) => void
    addExpense: (expense: Expense) => void
    setUser: (user: string[]) => void
    addUser: (user: string) => void
}

const useExpenseStore = create<ExpenseState>(set => ({
    expenses,
    user,
    categories,
    setExpenses: expenses => set(() => ({ expenses })),
    addExpense: expense => set(state => ({ expenses: [expense, ...state.expenses] })),
    setUser: user => set(() => ({ user })),
    addUser: user => set(state => ({ user: [user, ...state.user] })),
}))

export default useExpenseStore
