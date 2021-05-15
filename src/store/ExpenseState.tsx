import create from 'zustand'

import { Expense } from '../model/model'
import { FirebaseService } from '../services/firebase'

export type ExpenseStateValues = {
    expenses: Expense[]
    categories: string[]
    isNewExpenseDialogOpen: boolean
    autocompleteOptions: Record<
        keyof Pick<Expense, 'creator' | 'shop' | 'category' | 'description'>,
        string[]
    >
}

export const categories = ['Lebensmittel', 'Mobilität', 'Inventar', 'Sonstiges']

// MockData, will be removed when using Firestore
const initialState: ExpenseStateValues = {
    expenses: [],
    categories: categories,
    isNewExpenseDialogOpen: false,
    autocompleteOptions: { creator: [], shop: [], category: [], description: [] },
}

export type ExpenseState = ExpenseStateValues & {
    setExpenses: (expenses: Expense[]) => void
    addExpense: (expense: Expense, userId: string) => void
    openNewExpenseDialog: (isOpen: boolean) => void
    deleteExpense: (expenseId: string, userId: string) => void
    updateExpense: (expense: Expense, userId: string) => void
    setAutocompleteOptions: (autocompleteOptions: ExpenseStateValues['autocompleteOptions']) => void
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
    setAutocompleteOptions: autocompleteOptions => {
        set(() => ({ autocompleteOptions }))
    },
}))

export default useExpenseStore
