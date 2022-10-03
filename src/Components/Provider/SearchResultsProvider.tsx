import { createContext, FC, useContext, useState } from 'react'

import { Hit } from '@/model/model'

interface SearchResultContext {
    hits: ReadonlyArray<Hit>
    setHits: React.Dispatch<React.SetStateAction<readonly Hit[]>>
    error: boolean
    setError: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Context = createContext<SearchResultContext | null>(null)

export const useSearchResultsContext = () => useContext(Context) as SearchResultContext

const SearchResultsProvider: FC = ({ children }) => {
    const [hits, setHits] = useState<ReadonlyArray<Hit>>([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
        <Context.Provider value={{ hits, setHits, error, setError, loading, setLoading }}>
            {children}
        </Context.Provider>
    )
}

export default SearchResultsProvider
