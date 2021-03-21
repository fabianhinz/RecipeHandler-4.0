import firebase from 'firebase'
import create from 'zustand'

import { Expense } from '../../model/model'
import { FirebaseService } from '../../services/firebase'
import { userList } from './ExpenseState'

const initialCurrentExpense: Expense = {
    id: undefined,
    amount: 0,
    category: 'Lebensmittel',
    creator: '',
    date: FirebaseService.createTimestampFromDate(new Date()),
    relatedUsers: [...userList],
    shop: '',
    description: 'Einkauf',
}

export type CurrentExpenseState = Expense & {
    setAmount: (amount: number) => void
    setCategory: (category: string) => void
    setCreator: (creator: string) => void
    setDate: (date: firebase.firestore.Timestamp) => void
    setRelatedUsers: (user: string) => void
    setShop: (shop: string) => void
    setDescription: (description: string) => void
    clearState: () => void
    setCurrentExpense: (expense: Expense) => void
}

const useCurrentExpenseState = create<CurrentExpenseState>(set => ({
    ...initialCurrentExpense,
    setAmount: amount => set(() => ({ amount })),
    setCategory: category => set(() => ({ category })),
    setCreator: creator => set(() => ({ creator })),
    setDate: date => set(() => ({ date })),
    setRelatedUsers: user =>
        set(state => {
            if (state.relatedUsers.includes(user)) {
                if (state.relatedUsers.length === 1) return { relatedUsers: [...userList] }
                return { relatedUsers: [...state.relatedUsers.filter(u => u !== user)] }
            }
            return { relatedUsers: [user, ...state.relatedUsers] }
        }),
    setShop: shop => set(() => ({ shop })),
    setDescription: description => set(() => ({ description })),
    clearState: () => set(() => ({ ...initialCurrentExpense })),
    setCurrentExpense: ({ id, amount, category, creator, date, relatedUsers, shop, description }) =>
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

export default useCurrentExpenseState
