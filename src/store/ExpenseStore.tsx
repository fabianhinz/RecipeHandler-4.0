import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import create from 'zustand'

import expenseUtils from '@/Components/Expenses/helper/expenseUtils'
import { Expense } from '@/model/model'

export type AutocompleteOptionGroups =
  | 'creator'
  | 'shop'
  | 'category'
  | 'description'
export type ExpenseFilter = Partial<Pick<Expense, AutocompleteOptionGroups>>

export type ExpenseState = {
  loading: boolean
  expenses: Expense[]
  expenseFilter: ExpenseFilter
  hasActiveFilter: boolean
  expensesByMonth: Map<string, Expense[]>
  years: number[]
  categories: string[]
  isDialogOpen: boolean
  autocompleteOptions: Record<
    keyof Pick<Expense, AutocompleteOptionGroups>,
    string[]
  >
}

type ExpenseActions = {
  setExpenses: (expenses: Expense[]) => void
  setIsDialogOpen: (value: boolean) => void
  setAutocompleteOptions: (
    autocompleteOptions: ExpenseState['autocompleteOptions']
  ) => void
  setCategories: (categories: string[]) => void
  handleFirebaseSnapshot: (snapshot: QuerySnapshot<DocumentData>) => void
  handleExpenseFilterChange: <Key extends keyof ExpenseFilter>(
    key: Key,
    value: ExpenseFilter[Key]
  ) => void
}

export type ExpenseStore = ExpenseState & ExpenseActions

export const USER_COLLECTION = 'users'
export const EXPENSE_COLLECTION = 'expenses'
export const ARCHIVED_EXPENSES_COLLECTION = 'archivedExpenses'

const useExpenseStore = create<ExpenseStore>((set, get) => ({
  loading: true,
  expenses: [],
  allExpenses: [],
  expensesByMonth: new Map(),
  categories: [],
  isDialogOpen: false,
  years: [],
  autocompleteOptions: { creator: [], shop: [], category: [], description: [] },
  expenseFilter: {},
  hasActiveFilter: false,
  setCategories: categories => {
    set(() => ({
      categories,
    }))
  },
  setExpenses: expenses => set(() => ({ expenses })),
  setIsDialogOpen: value => {
    set(() => ({ isDialogOpen: value }))
  },
  setAutocompleteOptions: autocompleteOptions => {
    set(() => ({ autocompleteOptions }))
  },
  handleFirebaseSnapshot: snapshot => {
    const expenses = snapshot.docs.map(
      document => ({ ...document.data(), id: document.id } as Expense)
    )
    const uniqeMonths = Array.from(
      new Set(
        expenses.map(e => expenseUtils.getMonthStringByDate(e.date.toDate()))
      )
    )
    const years = Array.from(
      new Set(uniqeMonths.map(m => Number(m.split(' ')[1])))
    ).sort()

    const expensesByMonth = new Map(
      uniqeMonths.map(month => [
        month,
        expenses.filter(
          e => expenseUtils.getMonthStringByDate(e.date.toDate()) === month
        ),
      ])
    )
    const autocompleteOptions = {
      creator: Array.from(
        new Set([
          ...expenses.filter(e => e.creator).map(e => e.creator),
          ...expenses.map(e => e.relatedUsers).flat(),
        ])
      ).sort(),
      shop: Array.from(
        new Set(expenses.filter(e => e.shop).map(e => e.shop))
      ).sort(),
      category: Array.from(
        new Set(expenses.filter(e => e.category).map(e => e.category))
      ).sort(),
      description: Array.from(
        new Set(
          expenses.filter(e => e.description).map(e => e.description ?? '')
        )
      ).sort(),
    }

    set({
      loading: false,
      expenses,
      expensesByMonth,
      autocompleteOptions,
      years,
    })
  },
  handleExpenseFilterChange: (key, value) => {
    const nextFilter = { ...get().expenseFilter }

    if (nextFilter[key] === value) {
      delete nextFilter[key]
    } else {
      nextFilter[key] = value
    }

    set({
      expenseFilter: nextFilter,
      hasActiveFilter: Object.keys(nextFilter).length > 0,
    })
  },
}))

export default useExpenseStore
