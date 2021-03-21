import create from 'zustand'

import { Expense } from '../../model/model'
import { FirebaseService } from '../../services/firebase'

type ExpenseStateValues = {
    expenses: Expense[]
    user: string[]
    categories: string[]
    isNewExpenseDialogOpen: boolean
}

export const userList = ['Fabi', 'Miri', 'Hans']
export const categories = ['Lebensmittel', 'Mobilität', 'Inventar', 'Sonstiges']

// MockData, will be removed when using Firestore
const initialState: ExpenseStateValues = {
    expenses: [
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
    ],
    user: userList,
    categories,
    isNewExpenseDialogOpen: false,
}

export type ExpenseState = ExpenseStateValues & {
    setExpenses: (expenses: Expense[]) => void
    addExpense: (expense: Expense) => void
    setUser: (user: string[]) => void
    addUser: (user: string) => void
    openNewExpenseDialog: (isOpen: boolean) => void
    deleteExpense: (id: number) => void
    updateExpense: (id: number, expense: Expense) => void
}

const useExpenseStore = create<ExpenseState>(set => ({
    ...initialState,
    setExpenses: expenses => set(() => ({ expenses })),
    addExpense: expense => set(state => ({ expenses: [expense, ...state.expenses] })),
    setUser: user => set(() => ({ user })),
    addUser: user => set(state => ({ user: [user, ...state.user] })),
    deleteExpense: id =>
        set(state => {
            const newExpenses = [...state.expenses]
            newExpenses.splice(id, 1)
            return { expenses: newExpenses }
        }),
    openNewExpenseDialog: isNewExpenseDialogOpen => set(() => ({ isNewExpenseDialogOpen })),
    updateExpense: (id, expense) =>
        set(state => {
            const newExpenses = [...state.expenses]
            newExpenses.splice(id, 1, expense)
            return { expenses: newExpenses }
        }),
}))

export default useExpenseStore
