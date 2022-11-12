import { Chip, Collapse, Container, ListSubheader, makeStyles, TextField } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderGroupParams } from '@material-ui/lab'
import { useMemo, useState } from 'react'

import useExpenseStore, { AutocompleteOptionGroups, ExpenseFilter } from '@/store/ExpenseStore'

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
    cursor: 'pointer',
  },
}))

const LOCALIZED_LABELS: Record<AutocompleteOptionGroups, string> = {
  creator: 'Ersteller',
  shop: 'Geschäft',
  category: 'Kategorie',
  description: 'Beschreibung',
}

const ExpenseGroup = (props: AutocompleteRenderGroupParams) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)

  return (
    <div>
      <ListSubheader onClick={() => setOpen(!open)} className={classes.listSubheader}>
        {LOCALIZED_LABELS[props.group as AutocompleteOptionGroups]}
      </ListSubheader>
      <Collapse in={open}>{props.children}</Collapse>
    </div>
  )
}

interface AutocompleteOption {
  group: AutocompleteOptionGroups
  value: string
}

// eslint-disable-next-line react/no-multi-comp
export const ExpenseSearch = () => {
  const expenseFilter = useExpenseStore(store => store.expenseFilter)
  const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
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

  const valueByExpenseFilter = useMemo(() => {
    const options: AutocompleteOption[] = []

    for (const [group, value] of Object.entries(expenseFilter)) {
      options.push({ group: group as AutocompleteOptionGroups, value })
    }

    return options
  }, [expenseFilter])

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
        renderGroup={params => <ExpenseGroup {...params} />}
        getOptionSelected={(option, selected) =>
          option.group === selected.group && option.value === selected.value
        }
        fullWidth
        options={optionsFlattened}
        groupBy={option => option.group}
        getOptionLabel={option => option.value}
        value={valueByExpenseFilter}
        onChange={async (_, newValue) => {
          const latestEntry = newValue.at(-1)
          if (!latestEntry) {
            useExpenseStore.setState({ expenseFilter: {} })
            return
          }

          const newSearchValue = [
            ...newValue.filter(v => v.group !== latestEntry.group),
            latestEntry,
          ]
          const newFilter: ExpenseFilter = {}
          for (const { group, value } of newSearchValue) {
            newFilter[group] = value
          }
          useExpenseStore.setState({ expenseFilter: newFilter })
        }}
        renderInput={params => <TextField {...params} label="Ausgaben suchen" variant="filled" />}
      />
    </Container>
  )
}
