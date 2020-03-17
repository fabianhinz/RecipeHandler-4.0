import React, { FC, useContext, useState } from 'react'

import { Hits } from '../../model/model'

interface SearchResultContext {
    hits: ReadonlyArray<Hits>
    setHits: React.Dispatch<React.SetStateAction<readonly Hits[]>>
    error: boolean
    setError: React.Dispatch<React.SetStateAction<boolean>>
}

const Context = React.createContext<SearchResultContext | null>(null)

export const useSearchResultsContext = () => useContext(Context) as SearchResultContext

const SearchResultsProvider: FC = ({ children }) => {
    const [hits, setHits] = useState<ReadonlyArray<Hits>>([])
    const [error, setError] = useState(false)

    return (
        <Context.Provider value={{ hits, setHits, error, setError }}>{children}</Context.Provider>
    )
}

export default SearchResultsProvider
