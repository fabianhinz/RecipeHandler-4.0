import { IconButton } from '@material-ui/core/'
import { BookmarkMinus, BookmarkPlus } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useBookmarkContext } from '../../../Provider/BookmarkProvider'

interface RecipeResultPinProps {
    name: string
}

export const RecipeResultBookmark: FC<RecipeResultPinProps> = ({ name }) => {
    const { bookmarks, handleBookmarkChange } = useBookmarkContext()

    return (
        <IconButton onClick={() => handleBookmarkChange(name)}>
            {bookmarks.has(name) ? <BookmarkMinus /> : <BookmarkPlus />}
        </IconButton>
    )
}
