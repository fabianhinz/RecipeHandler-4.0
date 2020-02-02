import React, { FC, useCallback, useContext, useState } from 'react'

type BookmarkContext = {
    bookmarks: Set<string>
    handleBookmarkChange: (recipeName: string) => void
}

const Context = React.createContext<BookmarkContext | null>(null)

export const useBookmarkContext = () => useContext(Context) as BookmarkContext

const BookmarkProvider: FC = ({ children }) => {
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

    const handleBookmarkChange = useCallback(
        (recipeName: string) =>
            setBookmarks(prev => {
                if (prev.has(recipeName)) prev.delete(recipeName)
                else prev.add(recipeName)

                return new Set(prev)
            }),
        []
    )

    return (
        <Context.Provider
            value={{
                bookmarks,
                handleBookmarkChange,
            }}>
            {children}
        </Context.Provider>
    )
}

export default BookmarkProvider
