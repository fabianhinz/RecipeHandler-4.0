import { Chip, makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { useMemo, useState } from 'react'

import { Expense } from '@/model/model'
import { FirebaseService } from '@/services/firebase'
import useExpenseStore, { EXPENSE_COLLECTION, USER_COLLECTION } from '@/store/ExpenseStore'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { ExpenseAutocompleteWrapper } from './ExpenseAutocompleteWrapper'
import ExpenseCard from './ExpenseCard'

const useStyles = makeStyles(theme => ({
  expenseSearchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(2),
  },
  expenseSearchFlexContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}))

type ExpenseSearchValue = Pick<Expense, 'shop' | 'category' | 'description'>

const fetchMatchingDocuments = async (
  searchValue: ExpenseSearchValue,
  userId: string | undefined
): Promise<Expense[]> => {
  let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query =
    FirebaseService.firestore.collection(USER_COLLECTION).doc(userId).collection(EXPENSE_COLLECTION)

  for (const [key, value] of Object.entries(searchValue)) {
    if (value.length === 0) {
      continue
    }

    query = query.where(key, '==', value)
  }

  if (Object.values(searchValue).some(value => value.length > 0)) {
    const snapshot = await query.orderBy('date', 'desc').limit(25).get()
    return snapshot.docs.map(document => ({ ...document.data(), id: document.id } as Expense))
  }

  return []
}

export const ExpenseSearch = () => {
  const [searchValue, setSearchValue] = useState<ExpenseSearchValue>({
    shop: '',
    category: '',
    description: '',
  })
  const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
  const optionsFlattened = useMemo(() => {
    return Object.entries(autocompleteOptions)
      .map(([category, options]) => options.map(value => ({ category, value })))
      .flat()
  }, [autocompleteOptions])

  const [searchResults, setSearchResults] = useState<Expense[]>([])
  const authContext = useFirebaseAuthContext()

  const classes = useStyles()

  function handleAutocompleteChange<Key extends keyof typeof searchValue>(key: Key) {
    return async (value: Expense[Key]) => {
      const newSearchValue = { ...searchValue, [key]: value }

      setSearchValue(newSearchValue)
      setSearchResults(await fetchMatchingDocuments(newSearchValue, authContext.user?.uid))
    }
  }

  return (
    <>
      <Autocomplete
        multiple
        renderTags={(tags, props) =>
          tags.map(tag => (
            <Chip
              size="small"
              key={`${tag.category}:${tag.value}`}
              label={`${tag.category}:${tag.value}`}
            />
          ))
        }
        options={optionsFlattened}
        groupBy={option => option.category}
        getOptionLabel={option => option.value}
        style={{ width: 300 }}
        renderInput={params => <TextField {...params} label="Ausgaben suchen" variant="filled" />}
      />

      {/* <div className={classes.expenseSearchFlexContainer}>
        {searchResults.map(expense => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div> */}
    </>
  )
}
