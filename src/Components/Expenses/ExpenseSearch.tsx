import { AutocompleteRenderGroupParams } from '@mui/lab'
import {
  Backdrop,
  Chip,
  Collapse,
  Container,
  InputAdornment,
  InputBase,
  ListSubheader,
  Portal,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Autocomplete } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { ChevronRight } from 'mdi-material-ui'
import { useMemo, useState } from 'react'

import { useDisableScrollEffect } from '@/hooks/useDisableScrollEffect'
import { ReactComponent as FirebaseIcon } from '@/icons/firebase.svg'
import useExpenseStore, {
  AutocompleteOptionGroups,
  ExpenseFilter,
} from '@/store/ExpenseStore'

import NotFound from '../Shared/NotFound'

const useStyles = makeStyles<Theme, { open: boolean }>(theme => ({
  searchContainer: {
    display: 'flex',
    position: 'relative',
    backgroundColor: ({ open }) =>
      open
        ? '#fff'
        : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.08)',
    boxShadow: ({ open }) =>
      theme.palette.mode === 'light' && open ? theme.shadows[1] : 'unset',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.easeOut,
    }),
    borderBottomLeftRadius: props =>
      props.open ? 0 : theme.shape.borderRadius,
    borderBottomRightRadius: props =>
      props.open ? 0 : theme.shape.borderRadius,
  },
  searchInput: {
    ...theme.typography.h6,
    color: ({ open }) =>
      open || theme.palette.mode === 'light' ? '#000' : '#fff',
  },
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
  autoCompletePaper: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTop: 'unset',
    margin: 0,
  },
  backdrop: {
    zIndex: theme.zIndex.appBar - 1,
  },
}))

const LOCALIZED_LABELS: Record<AutocompleteOptionGroups, string> = {
  creator: 'Ersteller',
  shop: 'Geschäft',
  category: 'Kategorie',
  description: 'Beschreibung',
}

interface ExpenseGroupProps extends AutocompleteRenderGroupParams {
  collapsed: Record<AutocompleteOptionGroups, boolean>
  onCollapsedChange: (
    group: AutocompleteOptionGroups,
    collapsed: boolean
  ) => void
}

const useExpenseGroupStyles = makeStyles<Theme, { collapsed: boolean }>(
  theme => ({
    listSubheader: {
      display: 'flex',
      gap: theme.spacing(1),
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[1],
      padding: theme.spacing(0, 1),
      cursor: 'pointer',
    },
    chevron: {
      transition: theme.transitions.create('transform'),
      transform: props => `rotate(${props.collapsed ? 90 : 0}deg)`,
    },
  })
)

const ExpenseGroup = (props: ExpenseGroupProps) => {
  const group = props.group as AutocompleteOptionGroups
  const collapsed = props.collapsed[group]
  const classes = useExpenseGroupStyles({ collapsed })

  return (
    <div>
      <ListSubheader
        onClick={() => props.onCollapsedChange(group, !collapsed)}
        className={classes.listSubheader}>
        <ChevronRight className={classes.chevron} />{' '}
        <span>{LOCALIZED_LABELS[group]}</span>
      </ListSubheader>
      <Collapse in={collapsed}>{props.children}</Collapse>
    </div>
  )
}

interface AutocompleteOption {
  group: AutocompleteOptionGroups
  value: string
}

// eslint-disable-next-line react/no-multi-comp
export const ExpenseSearch = () => {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<ExpenseGroupProps['collapsed']>({
    category: false,
    creator: false,
    description: false,
    shop: false,
  })
  const theme = useTheme()
  const xsOnly = useMediaQuery(theme.breakpoints.only('xs'))
  const smAndMd = useMediaQuery(theme.breakpoints.between('sm', 'lg'))

  const expenseFilter = useExpenseStore(store => store.expenseFilter)
  const hasActiveFilter = useExpenseStore(store => store.hasActiveFilter)
  const autocompleteOptions = useExpenseStore(
    store => store.autocompleteOptions
  )

  useDisableScrollEffect(open)

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

  const classes = useStyles({ open })

  const limitTagsMemoized = useMemo(() => {
    if (xsOnly) {
      return 0
    }

    if (smAndMd) {
      return 2
    }

    return 3
  }, [smAndMd, xsOnly])

  return (
    <Container maxWidth="md" className={classes.container}>
      <Autocomplete
        classes={{
          listbox: classes.autoCompleteListBox,
          paper: classes.autoCompletePaper,
        }}
        multiple
        renderTags={(tags, getTagProps) => {
          const tagsToDisplay = tags.slice(0, limitTagsMemoized)
          const potentialTagOverflow = tagsToDisplay.length !== tags.length

          return (
            <>
              {tagsToDisplay.map((tag, index) => (
                <Chip
                  key={`${tag.group}:${tag.value}`}
                  label={`${LOCALIZED_LABELS[tag.group]}: ${tag.value}`}
                  style={{
                    maxWidth: smAndMd ? 200 : 300,
                    boxShadow: theme.shadows[1],
                  }}
                  {...getTagProps({ index })}
                />
              ))}
              {potentialTagOverflow && xsOnly && (
                <Typography style={{ whiteSpace: 'nowrap' }}>
                  {tags.length} Filter aktiv
                </Typography>
              )}
              {potentialTagOverflow && !xsOnly && (
                <Typography>+{tags.length - tagsToDisplay.length}</Typography>
              )}
            </>
          )
        }}
        renderGroup={params => (
          <ExpenseGroup
            {...params}
            collapsed={collapsed}
            onCollapsedChange={(group, isCollapsed) =>
              setCollapsed(prev => ({ ...prev, [group]: isCollapsed }))
            }
          />
        )}
        isOptionEqualToValue={(option, selected) =>
          option.group === selected.group && option.value === selected.value
        }
        fullWidth
        options={optionsFlattened}
        groupBy={option => option.group}
        getOptionLabel={option => option.value}
        value={valueByExpenseFilter}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        noOptionsText={<NotFound visible />}
        onChange={async (_, newValue) => {
          const latestEntry = newValue.at(-1)
          if (!latestEntry) {
            useExpenseStore.setState({
              expenseFilter: {},
              hasActiveFilter: false,
            })
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
          useExpenseStore.setState({
            expenseFilter: newFilter,
            hasActiveFilter: Object.keys(newFilter).length > 0,
          })
        }}
        open={open}
        onInputChange={(_, v) => {
          if (v.length > 0) {
            setCollapsed({
              category: true,
              creator: true,
              description: true,
              shop: true,
            })
          }
        }}
        renderInput={params => (
          <div ref={params.InputProps.ref} className={classes.searchContainer}>
            <InputBase
              inputProps={params.inputProps}
              {...params.InputProps}
              endAdornment={
                <InputAdornment position="end">
                  <FirebaseIcon width={25} />
                </InputAdornment>
              }
              className={classes.searchInput}
              fullWidth
              placeholder={hasActiveFilter ? '' : 'Ausgaben suchen'}
            />
          </div>
        )}
      />

      <Portal>
        <Backdrop className={classes.backdrop} open={open} />
      </Portal>
    </Container>
  )
}
