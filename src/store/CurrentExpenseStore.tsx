import { Timestamp } from 'firebase/firestore'
import create from 'zustand'

import { Expense } from '@/model/model'

import useExpenseStore from './ExpenseStore'

type ExpenseState = Expense

type ExpenseActions = {
  setAmount: (amount: number) => void
  setCategory: (category: string) => void
  setCreator: (creator: string) => void
  setDate: (date: Timestamp) => void
  setRelatedUsers: (user: string) => void
  setShop: (shop: string) => void
  setDescription: (description: string) => void
  clearState: () => void
  setCurrentExpense: (expense: Expense) => void
}

export type CurrentExpenseStore = ExpenseState & ExpenseActions

const getFreshExpense = () => ({
  id: undefined,
  amount: 0,
  category: 'Lebensmittel',
  creator: '',
  date: Timestamp.fromDate(new Date()),
  relatedUsers: [],
  shop: '',
  description: 'Einkauf',
})

const useCurrentExpenseStore = create<CurrentExpenseStore>(set => ({
  ...getFreshExpense(),
  setAmount: amount => set(() => ({ amount })),
  setCategory: category => set(() => ({ category })),
  setCreator: creator => set(() => ({ creator })),
  setDate: date => set(() => ({ date })),
  setRelatedUsers: user =>
    set(state => {
      if (state.relatedUsers.includes(user)) {
        if (state.relatedUsers.length === 1)
          return { relatedUsers: state.relatedUsers }
        return { relatedUsers: [...state.relatedUsers.filter(u => u !== user)] }
      }
      return { relatedUsers: [user, ...state.relatedUsers].sort() }
    }),
  setShop: shop => set(() => ({ shop })),
  setDescription: description => set(() => ({ description })),
  clearState: () =>
    set(() => ({
      ...getFreshExpense(),
      relatedUsers: useExpenseStore.getState().autocompleteOptions.creator,
    })),
  setCurrentExpense: ({
    id,
    amount,
    category,
    creator,
    date,
    relatedUsers,
    shop,
    description,
  }) =>
    set(() => ({
      id,
      amount,
      category,
      creator,
      date,
      description,
      shop,
      relatedUsers,
    })),
}))

export default useCurrentExpenseStore
