import create from 'zustand'

import expenseUtils from '@/Components/Expenses/helper/expenseUtils'
import { ArchivedExpense, Expense } from '@/model/model'
import { FirebaseService } from '@/services/firebase'

export type ExpenseState = {
    loading: boolean
    expenses: Expense[]
    expensesByMonth: Map<string, Expense[]>
    years: number[]
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
    archiveExpense: (expense: Expense, userId: string) => void
    clearArchive: (archivedExpense: ArchivedExpense[], userId: string) => void
    restoreExpense: (archivedExpense: ArchivedExpense, userId: string) => void
    updateExpense: (expense: Expense, userId: string) => void
    setAutocompleteOptions: (autocompleteOptions: ExpenseState['autocompleteOptions']) => void
    setCategories: (categories: string[]) => void
    handleFirebaseSnapshot: (
        snapshot: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>
    ) => void
}

export type ExpenseStore = ExpenseState & ExpenseActions

export const USER_COLLECTION = 'users'
export const EXPENSE_COLLECTION = 'expenses'
export const ARCHIVED_EXPENSES_COLLECTION = 'archivedExpenses'

const useExpenseStore = create<ExpenseStore>(set => ({
    loading: true,
    expenses: [],
    expensesByMonth: new Map(),
    categories: [],
    isNewExpenseDialogOpen: false,
    years: [],
    autocompleteOptions: { creator: [], shop: [], category: [], description: [] },
    setCategories: categories => {
        set(() => ({
            categories,
        }))
    },
    setExpenses: expenses => set(() => ({ expenses })),
    addExpense: (expense, userId) =>
        FirebaseService.firestore
            .collection(USER_COLLECTION)
            .doc(userId)
            .collection(EXPENSE_COLLECTION)
            .add(expense),
    archiveExpense: async ({ id, ...expense }, userId) => {
        const userDoc = FirebaseService.firestore.collection(USER_COLLECTION).doc(userId)
        await userDoc
            .collection(ARCHIVED_EXPENSES_COLLECTION)
            .add({ ...expense, deletedAt: FirebaseService.createTimestampFromDate(new Date()) })
        await userDoc.collection(EXPENSE_COLLECTION).doc(id).delete()
    },
    restoreExpense: async ({ deletedAt, ...expense }, userId) => {
        const userDoc = FirebaseService.firestore.collection(USER_COLLECTION).doc(userId)
        await userDoc.collection(EXPENSE_COLLECTION).add(expense)
        await userDoc.collection(ARCHIVED_EXPENSES_COLLECTION).doc(expense.id).delete()
    },
    clearArchive: async (expenses, userId) => {
        await Promise.all(
            expenses.map(e =>
                FirebaseService.firestore
                    .collection(USER_COLLECTION)
                    .doc(userId)
                    .collection(ARCHIVED_EXPENSES_COLLECTION)
                    .doc(e.id)
                    .delete()
            )
        )
    },
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
    handleFirebaseSnapshot: snapshot => {
        const expenses = snapshot.docs.map(
            document => ({ ...document.data(), id: document.id } as Expense)
        )
        const uniqeMonths = Array.from(
            new Set(expenses.map(e => expenseUtils.getMonthStringByDate(e.date.toDate())))
        )
        const years = Array.from(new Set(uniqeMonths.map(m => Number(m.split(' ')[1])))).sort()

        const expensesByMonth = new Map(
            uniqeMonths.map(month => [
                month,
                expenses.filter(e => expenseUtils.getMonthStringByDate(e.date.toDate()) === month),
            ])
        )
        const autocompleteOptions = {
            creator: Array.from(
                new Set([
                    ...expenses.filter(e => e.creator).map(e => e.creator),
                    ...expenses.map(e => e.relatedUsers).flat(),
                ])
            ).sort(),
            shop: Array.from(new Set(expenses.filter(e => e.shop).map(e => e.shop))).sort(),
            category: Array.from(
                new Set(expenses.filter(e => e.category).map(e => e.category))
            ).sort(),
            description: Array.from(
                new Set(expenses.filter(e => e.description).map(e => e.description ?? ''))
            ).sort(),
        }

        set({ loading: false, expenses, expensesByMonth, autocompleteOptions, years })
    },
}))

export default useExpenseStore
