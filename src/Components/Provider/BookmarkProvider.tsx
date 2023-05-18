import { updateDoc } from 'firebase/firestore'
import { createContext, FC, useContext, useEffect, useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { resolveDoc } from '@/firebase/firebaseQueries'
import { User } from '@/model/model'

type BookmarkContext = {
  bookmarks: Set<string>
  handleBookmarkChange: (recipeName: string) => Promise<void>
}

const Context = createContext<BookmarkContext | null>(null)

export const useBookmarkContext = () => useContext(Context) as BookmarkContext

const BookmarkProvider: FC = ({ children }) => {
  const { user } = useFirebaseAuthContext()
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    if (!user) {
      return new Set()
    } else {
      return new Set(user.bookmarks)
    }
  })

  useEffect(() => {
    if (!user || !user.bookmarkSync) return
    setBookmarks(new Set(user.bookmarks))
  }, [user])

  const handleBookmarkChange = async (recipeName: string) => {
    const newBookmarks = new Set(bookmarks)

    if (newBookmarks.has(recipeName)) {
      newBookmarks.delete(recipeName)
    } else {
      newBookmarks.add(recipeName)
    }

    if (user && user.bookmarkSync) {
      const update: Partial<User> = {
        bookmarks: [...newBookmarks],
      }
      await updateDoc(resolveDoc('users', user.uid), update)
    }

    setBookmarks(newBookmarks)
  }

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
