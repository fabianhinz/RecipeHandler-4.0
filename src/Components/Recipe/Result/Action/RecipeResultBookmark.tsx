import { IconButton, Tooltip, TooltipProps } from '@material-ui/core/'
import { BookmarkMinus, BookmarkPlus } from 'mdi-material-ui'
import React, { FC } from 'react'

import { useBookmarkContext } from '../../../Provider/BookmarkProvider'

interface RecipeResultPinProps {
    name: string
    tooltipProps?: Pick<TooltipProps, 'placement'>
}

export const RecipeResultBookmark: FC<RecipeResultPinProps> = ({ name, tooltipProps }) => {
    const { bookmarks, handleBookmarkChange } = useBookmarkContext()

    return (
        <Tooltip
            {...tooltipProps}
            title={
                bookmarks.has(name) ? 'Von den Lesezeichen entfernen' : 'Zu Lesezeichen hinzufügen'
            }>
            <IconButton onClick={() => handleBookmarkChange(name)}>
                {bookmarks.has(name) ? <BookmarkMinus /> : <BookmarkPlus />}
            </IconButton>
        </Tooltip>
    )
}
