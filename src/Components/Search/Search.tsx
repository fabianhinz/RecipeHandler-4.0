import {
  Backdrop,
  Container,
  Grow,
  Hidden,
  InputAdornment,
  InputBase,
  makeStyles,
  Paper,
  Portal,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'

import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useSearchResultsContext } from '@/Components/Provider/SearchResultsProvider'
import { PATHS } from '@/Components/Routes/Routes'
import useDebounce from '@/hooks/useDebounce'
import { useDisableScrollEffect } from '@/hooks/useDisableScrollEffect'
import { ReactComponent as AlgoliaIcon } from '@/icons/algolia.svg'
import { Hit } from '@/model/model'
import algolia from '@/services/algolia'
import { BORDER_RADIUS } from '@/theme'

import SearchResults from './SearchResults'

interface StyleProps {
  focused: boolean
  showResultsPaper: boolean
}

const useStyles = makeStyles(theme => ({
  searchContainer: {
    display: 'flex',
    position: 'relative',
    backgroundColor: ({ focused }: StyleProps) =>
      focused
        ? '#fff'
        : theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.08)',
    boxShadow: ({ focused }: StyleProps) =>
      theme.palette.type === 'light' && focused ? theme.shadows[1] : 'unset',
    borderRadius: BORDER_RADIUS,
    padding: theme.spacing(1),
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.easeOut,
    }),
    borderBottomLeftRadius: (props: StyleProps) =>
      props.showResultsPaper ? 0 : BORDER_RADIUS,
    borderBottomRightRadius: (props: StyleProps) =>
      props.showResultsPaper ? 0 : BORDER_RADIUS,
  },
  searchResultsPaper: {
    boxShadow: theme.palette.type === 'light' ? theme.shadows[1] : 'unset',
    backgroundColor: theme.palette.background.default,
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'absolute',
    top: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    left: 0,
    width: '100%',
    maxHeight: '50vh',
    overflowY: 'auto',
  },
  searchInput: {
    ...theme.typography.h6,
    color: ({ focused }: StyleProps) =>
      focused || theme.palette.type === 'light' ? '#000' : '#fff',
  },
  alert: {
    borderRadius: BORDER_RADIUS,
  },
  container: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.appBar - 1,
  },
}))

export const AlgoliaDocSearchRef = (
  <a
    style={{ lineHeight: 0 }}
    target="_blank"
    rel="noopener noreferrer"
    href="https://www.algolia.com/docsearch">
    <AlgoliaIcon />
  </a>
)

const Search = () => {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')

  const history = useHistory()
  const debouncedValue = useDebounce(value, 500)
  const { mdUp } = useBreakpointsContext()
  const showResultsPaper = useMemo(
    () => focused && mdUp && debouncedValue.length > 0,
    [debouncedValue.length, focused, mdUp]
  )
  const classes = useStyles({ focused, showResultsPaper })
  const theme = useTheme()

  const { user } = useFirebaseAuthContext()
  const { setError, setHits, error, setLoading } = useSearchResultsContext()
  const { enqueueSnackbar } = useSnackbar()

  useDisableScrollEffect(showResultsPaper)

  useEffect(() => {
    if (error)
      enqueueSnackbar('Fehler beim Abrufen der Daten', { variant: 'error' })
  }, [enqueueSnackbar, error])

  const searchAlgolia = useCallback(
    () => {
      setLoading(true)
      algolia
        .search<Hit>(debouncedValue, {
          advancedSyntax: user?.algoliaAdvancedSyntax ? true : false,
          attributesToSnippet: ['description', 'ingredients'],
          highlightPreTag: `<span style="background-color: ${theme.palette.primary.main}; color: ${theme.palette.primary.contrastText}">`,
          highlightPostTag: '</span>',
        })
        .then(results => {
          setHits(results.hits)
        })
        .catch(error => {
          setError(error)
        })
        .then(() => {
          if (!mdUp) history.push(PATHS.searchResults)
          setLoading(false)
        })
    },
    // ? we don't want this to change on every user change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedValue, history, setError, setHits, user?.algoliaAdvancedSyntax]
  )

  useEffect(() => {
    if (debouncedValue.length > 0) searchAlgolia()
  }, [debouncedValue, searchAlgolia])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    searchAlgolia()
  }

  const handleFocusChange = (direction: 'in' | 'out') => () => {
    setFocused(direction === 'in' ? true : false)
  }

  return (
    <>
      <Container maxWidth="md" className={classes.container}>
        <form onSubmit={handleSubmit} className={classes.searchContainer}>
          <InputBase
            onFocus={handleFocusChange('in')}
            onBlur={handleFocusChange('out')}
            className={classes.searchInput}
            fullWidth
            placeholder="Rezepte suchen"
            value={value}
            onChange={handleInputChange}
            endAdornment={
              <Hidden xsDown>
                <InputAdornment position="end">
                  {AlgoliaDocSearchRef}
                </InputAdornment>
              </Hidden>
            }
          />

          <Grow in={showResultsPaper} mountOnEnter>
            <Paper className={classes.searchResultsPaper}>
              <SearchResults />
            </Paper>
          </Grow>
        </form>
      </Container>

      <Portal>
        <Backdrop className={classes.backdrop} open={showResultsPaper} />
      </Portal>
    </>
  )
}

export default Search
