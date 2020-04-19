import {
    Container,
    createStyles,
    Hidden,
    InputAdornment,
    InputBase,
    makeStyles,
} from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useDebounce from '../../hooks/useDebounce'
import { ReactComponent as AlgoliaIcon } from '../../icons/algolia.svg'
import { Hits } from '../../model/model'
import algolia from '../../services/algolia'
import { BORDER_RADIUS } from '../../theme'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useSearchResultsContext } from '../Provider/SearchResultsProvider'
import { PATHS } from '../Routes/Routes'

interface StyleProps {
    focused: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
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
            transition: theme.transitions.create('background-color', {
                easing: theme.transitions.easing.easeOut,
            }),
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
    })
)

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
    const classes = useStyles({ focused })
    const debouncedValue = useDebounce(value, 500)

    const { user } = useFirebaseAuthContext()
    const { setError, setHits } = useSearchResultsContext()

    const searchAlgolia = useCallback(
        () =>
            algolia
                .search<Hits>(debouncedValue, {
                    advancedSyntax: user?.algoliaAdvancedSyntax ? true : false,
                })
                .then(({ hits }) => {
                    setHits(hits)
                    history.push(PATHS.searchResults)
                })
                .catch(error => {
                    setError(error)
                    history.push(PATHS.searchResults)
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
                            <InputAdornment position="end">{AlgoliaDocSearchRef}</InputAdornment>
                        </Hidden>
                    }
                />
            </form>
        </Container>
    )
}

export default Search
