import create from 'zustand'

import { Expense } from '../model/model'
import { FirebaseService } from '../services/firebase'

export type ExpenseState = {
    expenses: Expense[]
    categories: string[]
    isNewExpenseDialogOpen: boolean
    autocompleteOptions: Record<
        keyof Pick<Expense, 'creator' | 'shop' | 'category' | 'description'>,
        string[]
    >
}

type ExpenseActions = {
    setExpenses: (expenses: Expense[]) => void
    addExpense: (expense: Expense, userId: string) => void
    openNewExpenseDialog: (isOpen: boolean) => void
    deleteExpense: (expenseId: string, userId: string) => void
    updateExpense: (expense: Expense, userId: string) => void
    setAutocompleteOptions: (autocompleteOptions: ExpenseState['autocompleteOptions']) => void
}

export type ExpenseStore = ExpenseState & ExpenseActions

export const USER_COLLECTION = 'users'
export const EXPENSE_COLLECTION = 'expenses'

const useExpenseStore = create<ExpenseStore>(set => ({
    expenses: [],
    categories: ['Lebensmittel', 'Mobilität', 'Inventar', 'Sonstiges'],
    isNewExpenseDialogOpen: false,
    autocompleteOptions: { creator: [], shop: [], category: [], description: [] },
    setExpenses: expenses => set(() => ({ expenses })),
    addExpense: (expense, userId) =>
        FirebaseService.firestore
            .collection(USER_COLLECTION)
            .doc(userId)
            .collection(EXPENSE_COLLECTION)
            .add(expense),
    deleteExpense: (expenseId, userId) =>
        FirebaseService.firestore
            .collection(USER_COLLECTION)
            .doc(userId)
            .collection(EXPENSE_COLLECTION)
            .doc(expenseId)
            .delete(),
    openNewExpenseDialog: isNewExpenseDialogOpen => set(() => ({ isNewExpenseDialogOpen })),
    updateExpense: ({ id, ...expense }, userId) =>
        FirebaseService.firestore
            .collection(USER_COLLECTION)
            .doc(userId)
            .collection(EXPENSE_COLLECTION)
            .doc(id)
            .update(expense),
    setAutocompleteOptions: autocompleteOptions => {
        set(() => ({ autocompleteOptions }))
    },
}))

export default useExpenseStore
