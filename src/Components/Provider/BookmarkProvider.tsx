import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { useFirebaseAuthContext } from './FirebaseAuthProvider'

type BookmarkContext = {
    bookmarks: Set<string>
    handleBookmarkChange: (recipeName: string) => void
}

const Context = React.createContext<BookmarkContext | null>(null)

export const useBookmarkContext = () => useContext(Context) as BookmarkContext

const BookmarkProvider: FC = ({ children }) => {
    const { user } = useFirebaseAuthContext()
    const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
        if (!user) return new Set()
        else return new Set(user.bookmarks)
    })

    useEffect(() => {
        if (!user || !user.bookmarkSync) return
        setBookmarks(new Set(user.bookmarks))
    }, [user])

    const handleBookmarkChange = useCallback(
        (recipeName: string) =>
            setBookmarks(prev => {
                if (prev.has(recipeName)) prev.delete(recipeName)
                else prev.add(recipeName)

                const newBookmarksSet = new Set(prev)

                if (user && user.bookmarkSync)
                    FirebaseService.firestore
                        .collection('users')
                        .doc(user.uid)
                        .update({ bookmarks: [...newBookmarksSet.values()] })

                return newBookmarksSet
            }),
        [user]
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
