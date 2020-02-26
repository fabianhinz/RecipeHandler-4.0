import {
    createStyles,
    Grow,
    Hidden,
    InputAdornment,
    InputBase,
    List,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'

import useDebounce from '../../hooks/useDebounce'
import { ReactComponent as AlgoliaIcon } from '../../icons/algolia.svg'
import { ReactComponent as Logo } from '../../icons/logo.svg'
import { Hit, Hits } from '../../model/model'
import algolia from '../../services/algolia'
import { BORDER_RADIUS } from '../../theme'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import NotFound from '../Shared/NotFound'
import Skeletons from '../Shared/Skeletons'
import SearchResult from './SearchResult'

const useStyles = makeStyles(theme =>
    createStyles({
        logo: {
            marginRight: theme.spacing(0.5),
            height: 40,
        },
        searchContainer: {
            flexGrow: 1,

            display: 'flex',
        },
        searchResultsPaper: {
            position: 'absolute',
            left: 0,
            top: theme.spacing(9),
            width: '100%',
            padding: theme.spacing(2),
            minHeight: '20vh',
            maxHeight: '40vh',
            [theme.breakpoints.down('xs')]: {
                maxHeight: '30vh',
            },
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: theme.zIndex.modal,
            boxShadow: theme.shadows[2],
        },
        alert: {
            borderRadius: BORDER_RADIUS,
        },
    })
)

export const AlgoliaDocSearchRef = (
    <a
        style={{ lineHeight: 0, width: '100%', textAlign: 'center' }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.algolia.com/docsearch">
        <AlgoliaIcon />
    </a>
)

const Search = () => {
    const [value, setValue] = useState('')
    const [results, setResults] = useState<Hits>([])
    const [resultsOpen, setResultsOpen] = useState(false)
    const [error, setError] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const classes = useStyles()

    const debouncedValue = useDebounce(value, 500)

    const { user } = useFirebaseAuthContext()

    useEffect(() => {
        if (debouncedValue.length > 0) {
            algolia
                .search<Hit>(debouncedValue, {
                    advancedSyntax: user && user.algoliaAdvancedSyntax ? true : false,
                })
                .then(({ hits }) => {
                    setError(null)
                    setResults(hits)
                    setLoading(false)
                })
                .catch(error => {
                    setError(error)
                    setLoading(false)
                })
        } else {
            setResults([])
            setLoading(false)
        }
    }, [debouncedValue, user])

    const handleInputChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setLoading(true)
        setResults([])
        setValue(event.target.value)
    }

    const closeResults = () => setResultsOpen(false)

    const openResults = () => setResultsOpen(true)

    return (
        <div className={classes.searchContainer} onFocus={openResults} onBlur={closeResults}>
            <InputBase
                fullWidth
                placeholder="Suchen"
                value={value}
                onChange={handleInputChange}
                startAdornment={
                    <InputAdornment position="start">
                        <Logo className={classes.logo} />
                    </InputAdornment>
                }
                endAdornment={
                    <Hidden smDown>
                        <InputAdornment position="end">{AlgoliaDocSearchRef}</InputAdornment>
                    </Hidden>
                }
            />

            <Grow in={value.length > 0 && resultsOpen}>
                <Paper className={classes.searchResultsPaper}>
                    <List disablePadding>
                        {results.map(result => (
                            <SearchResult
                                key={result.name}
                                result={result}
                                onResultClick={closeResults}
                                searchValue={value}
                            />
                        ))}
                        <Skeletons variant="search" visible={loading} numberOfSkeletons={3} />
                    </List>

                    {results.length >= 20 && (
                        <Alert className={classes.alert} color="info">
                            Für weitere Ergebnisse Suche detaillieren
                        </Alert>
                    )}

                    <NotFound visible={!loading && results.length === 0 && value.length > 0} />

                    {!loading && error && (
                        <Typography gutterBottom align="center" variant="h6">
                            Fehler beim Abruf der Daten
                        </Typography>
                    )}
                </Paper>
            </Grow>
        </div>
    )
}

export default Search
