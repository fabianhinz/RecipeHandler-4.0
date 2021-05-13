import create from 'zustand'

import { Expense } from '../model/model'
import { FirebaseService } from '../services/firebase'

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
    expenses: [],
    user: userList,
    categories: categories,
    isNewExpenseDialogOpen: false,
}

export type ExpenseState = ExpenseStateValues & {
    setExpenses: (expenses: Expense[]) => void
    addExpense: (expense: Expense, userId: string) => void
    setUser: (user: string[]) => void
    addUser: (user: string) => void
    openNewExpenseDialog: (isOpen: boolean) => void
    deleteExpense: (expenseId: string, userId: string) => void
    updateExpense: (expense: Expense, userId: string) => void
}

export const userCollection = 'users'
export const expensesCollection = 'expenses'

const useExpenseStore = create<ExpenseState>(set => ({
    ...initialState,
    setExpenses: expenses => set(() => ({ expenses })),
    addExpense: (expense, userId) =>
        FirebaseService.firestore
            .collection(userCollection)
            .doc(userId)
            .collection(expensesCollection)
            .add(expense),
    setUser: user => set(() => ({ user })),
    addUser: user => set(state => ({ user: [user, ...state.user] })),
    deleteExpense: (expenseId, userId) =>
        FirebaseService.firestore
            .collection(userCollection)
            .doc(userId)
            .collection(expensesCollection)
            .doc(expenseId)
            .delete(),
    openNewExpenseDialog: isNewExpenseDialogOpen => set(() => ({ isNewExpenseDialogOpen })),
    updateExpense: ({ id, ...expense }, userId) =>
        FirebaseService.firestore
            .collection(userCollection)
            .doc(userId)
            .collection(expensesCollection)
            .doc(id)
            .update(expense),
}))

export default useExpenseStore
