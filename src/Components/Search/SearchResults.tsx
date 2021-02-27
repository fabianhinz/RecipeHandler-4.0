import { Grid } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { useSearchResultsContext } from '../Provider/SearchResultsProvider'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import SearchResult from './SearchResult'

const SearchResults = () => {
    const { hits } = useSearchResultsContext()

    useDocumentTitle('Ergebnisse')

    return (
        <EntryGridContainer>
            {hits.length === 20 && (
                <Grid item xs={12}>
                    <Alert color="info">Maximale Anzahl an Suchergebnissen erreicht</Alert>
                </Grid>
            )}

            {hits.map(hit => (
                <SearchResult key={hit.name} name={hit.name} />
            ))}
            <NotFound visible={hits.length === 0} />
        </EntryGridContainer>
    )
}

export default SearchResults
