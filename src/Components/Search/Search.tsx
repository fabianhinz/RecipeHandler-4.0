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
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useDebounce from '../../hooks/useDebounce'
import { ReactComponent as AlgoliaIcon } from '../../icons/algolia.svg'
import { Hits } from '../../model/model'
import algolia from '../../services/algolia'
import { BORDER_RADIUS } from '../../theme'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useSearchResultsContext } from '../Provider/SearchResultsProvider'
import { PATHS } from '../Routes/Routes'
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
        borderBottomLeftRadius: (props: StyleProps) => (props.showResultsPaper ? 0 : BORDER_RADIUS),
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
        maxHeight: '60vh',
        overflowY: 'auto',
        padding: theme.spacing(3),
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
        backdropFilter: 'blur(4px)',
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
    const { isTablet } = useBreakpointsContext()
    const showResultsPaper = useMemo(() => focused && isTablet && debouncedValue.length > 0, [
        debouncedValue.length,
        focused,
        isTablet,
    ])
    const classes = useStyles({ focused, showResultsPaper })

    const { user } = useFirebaseAuthContext()
    const { setError, setHits, error } = useSearchResultsContext()
    const { enqueueSnackbar } = useSnackbar()

    useLayoutEffect(() => {
        const htmlEl = document.getElementsByTagName('html')[0]
        const headerEl = document.getElementsByTagName('header')[0]
        if (showResultsPaper) {
            htmlEl.setAttribute('style', 'overflow:hidden; padding-right:16px')
            headerEl.setAttribute('style', 'padding-right:16px;')
        } else {
            htmlEl.removeAttribute('style')
            headerEl.removeAttribute('style')
        }
    }, [showResultsPaper])

    useEffect(() => {
        if (error) enqueueSnackbar('Fehler beim Abrufen der Daten', { variant: 'error' })
    }, [enqueueSnackbar, error])

    const searchAlgolia = useCallback(
        () =>
            algolia
                .search<Hits>(debouncedValue, {
                    advancedSyntax: user?.algoliaAdvancedSyntax ? true : false,
                })
                .then(({ hits }) => {
                    setHits(hits)
                })
                .catch(error => {
                    setError(error)
                })
                .then(() => {
                    if (!isTablet) history.push(PATHS.searchResults)
                }),
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
                        placeholder="Suchen"
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
                <Backdrop id="whereami" className={classes.backdrop} open={showResultsPaper} />
            </Portal>
        </>
    )
}

export default Search
