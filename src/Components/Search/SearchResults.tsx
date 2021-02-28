import { List } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { useSearchResultsContext } from '../Provider/SearchResultsProvider'
import NotFound from '../Shared/NotFound'
import SearchResult from './SearchResult'

const SearchResults = () => {
    const { hits } = useSearchResultsContext()

    useDocumentTitle('Ergebnisse')

    return (
        <>
            {hits.length === 20 && (
                <Alert color="info">Maximale Anzahl an Suchergebnissen erreicht</Alert>
            )}

            <List disablePadding>
                {hits.map(hit => (
                    <SearchResult hit={hit} key={hit.name} />
                ))}
            </List>
            <NotFound visible={hits.length === 0} />
        </>
    )
}

export default SearchResults
