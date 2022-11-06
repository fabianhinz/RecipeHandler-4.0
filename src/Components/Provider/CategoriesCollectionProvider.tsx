import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react'

import { Categories } from '@/model/model'
import { FirebaseService } from '@/services/firebase'
import useExpenseStore from '@/store/ExpenseStore'
import { sortFn, sortObjectKeys } from '@/util/fns'

type CategoriesCollection = {
  recipeCategories: Categories<Array<string>>
  expenseCategories: Categories<Array<string>>
  categoriesLoading: boolean
}

const Context = createContext<CategoriesCollection | null>(null)

export const useCategoriesCollectionContext = () => useContext(Context) as CategoriesCollection

const CategoriesCollectionProvider: FC = ({ children }) => {
  const [recipeCategories, setRecipeCategories] = useState<Categories<Array<string>>>({})
  const [expenseCategories, setExpenseCategories] = useState<Categories<Array<string>>>({})
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    const categoriesRef = FirebaseService.firestore.collection('categories')
    const categories = [categoriesRef.doc('recipes').get(), categoriesRef.doc('expenses').get()]

    const [recipes, expenses] = await Promise.all(categories)

    const recipesData = recipes.data() as Categories<Array<string>>
    setRecipeCategories(sortObjectKeys('asc', recipesData) ?? {})

    const expensesData = expenses.data() as Categories<Array<string>>
    const newExpenseCategories = expensesData ?? {}
    setExpenseCategories(sortObjectKeys('asc', newExpenseCategories))
    // in a world without providers this would actually be handled by the store ...
    useExpenseStore
      .getState()
      .setCategories(newExpenseCategories.autocomplete?.sort(sortFn('asc')) ?? [])

    setCategoriesLoading(false)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <Context.Provider value={{ recipeCategories, expenseCategories, categoriesLoading }}>
      {children}
    </Context.Provider>
  )
}

export default CategoriesCollectionProvider
