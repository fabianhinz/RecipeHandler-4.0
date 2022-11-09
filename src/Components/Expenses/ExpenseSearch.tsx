import { Chip, Container, ListSubheader, makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { useMemo, useState } from 'react'

import { Expense } from '@/model/model'
import { FirebaseService } from '@/services/firebase'
import useExpenseStore, {
  AutocompleteOptionGroups,
  EXPENSE_COLLECTION,
  ExpenseState,
  USER_COLLECTION,
} from '@/store/ExpenseStore'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

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
  container: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  autoCompleteListBox: {
    padding: 0,
  },
  listSubheader: {
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[1],
  },
}))

const fetchMatchingDocuments = async (
  searchValue: AutocompleteOption[],
  userId: string | undefined
): Promise<void> => {
  if (searchValue.length === 0) {
    useExpenseStore.getState().handleExpensesChange([])
    return
  }
  // TODO creating a query is stupid. The client already has all necessary data in the store 🚀
  let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query =
    FirebaseService.firestore.collection(USER_COLLECTION).doc(userId).collection(EXPENSE_COLLECTION)

  for (const { group, value } of searchValue) {
    query = query.where(group, '==', value)
  }

  const snapshot = await query.orderBy('date', 'desc').get()
  const expenses = snapshot.docs.map(
    document => ({ ...document.data(), id: document.id } as Expense)
  )
  useExpenseStore.getState().handleExpensesChange(expenses)
}

const LOCALIZED_LABELS: Record<string, string> = {
  shop: 'Geschäft',
  category: 'Kategorie',
  description: 'Beschreibung',
}

interface AutocompleteOption {
  group: AutocompleteOptionGroups
  value: string
}

export const ExpenseSearch = () => {
  const [searchValue, setSearchValue] = useState<AutocompleteOption[]>([])
  const autocompleteOptions = useExpenseStore(store => {
    const { category, description, shop } = store.autocompleteOptions
    return { category, description, shop }
  })
  const optionsFlattened = useMemo(() => {
    return Object.entries(autocompleteOptions)
      .map(([group, options]) =>
        options.map(value => {
          const searchOption: AutocompleteOption = {
            group: group as AutocompleteOptionGroups,
            value,
          }
          return searchOption
        })
      )
      .flat()
  }, [autocompleteOptions])

  const authContext = useFirebaseAuthContext()

  const classes = useStyles()

  return (
    <Container maxWidth="md" className={classes.container}>
      <Autocomplete
        classes={{ listbox: classes.autoCompleteListBox }}
        multiple
        renderTags={(tags, getTagProps) =>
          tags.map((tag, index) => (
            <Chip
              size="small"
              color="secondary"
              key={`${tag.group}:${tag.value}`}
              label={`${LOCALIZED_LABELS[tag.group]}: ${tag.value}`}
              {...getTagProps({ index })}
            />
          ))
        }
        renderGroup={params => (
          <div key={params.key}>
            <ListSubheader className={classes.listSubheader}>
              {LOCALIZED_LABELS[params.group]}
            </ListSubheader>
            {params.children}
          </div>
        )}
        getOptionSelected={(option, selected) =>
          option.group === selected.group && option.value === selected.value
        }
        fullWidth
        options={optionsFlattened}
        groupBy={option => option.group}
        getOptionLabel={option => option.value}
        value={searchValue}
        onChange={async (_, newValue) => {
          const latestEntry = newValue.at(-1)
          if (!latestEntry) {
            await fetchMatchingDocuments([], authContext.user?.uid)
            setSearchValue(newValue)
            return
          }

          const newSearchValue = [
            ...newValue.filter(v => v.group !== latestEntry.group),
            latestEntry,
          ]
          setSearchValue(newSearchValue)
          await fetchMatchingDocuments(newSearchValue, authContext.user?.uid)
        }}
        renderInput={params => <TextField {...params} label="Ausgaben suchen" variant="filled" />}
      />
    </Container>
  )
}
