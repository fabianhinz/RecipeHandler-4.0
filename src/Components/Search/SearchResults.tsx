import { List } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { useSearchResultsContext } from '@/Components/Provider/SearchResultsProvider'
import NotFound from '@/Components/Shared/NotFound'
import useDocumentTitle from '@/hooks/useDocumentTitle'

import SearchResult from './SearchResult'

const SearchResults = () => {
    const { hits, loading } = useSearchResultsContext()

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

            {!loading && <NotFound visible={hits.length === 0} />}
        </>
    )
}

export default SearchResults
