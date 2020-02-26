import { IconButton, Tooltip, TooltipProps } from '@material-ui/core/'
import { Bookmark, BookmarkOff } from 'mdi-material-ui'
import React from 'react'

import { useBookmarkContext } from '../Provider/BookmarkProvider'

interface Props {
    name: string
    tooltipProps?: Pick<TooltipProps, 'placement'>
}

const RecipeBookmarkButton = ({ name, tooltipProps }: Props) => {
    const { bookmarks, handleBookmarkChange } = useBookmarkContext()

    return (
        <Tooltip
            {...tooltipProps}
            title={
                bookmarks.has(name) ? 'Von den Lesezeichen entfernen' : 'Zu Lesezeichen hinzufügen'
            }>
            <IconButton onClick={() => handleBookmarkChange(name)}>
                {bookmarks.has(name) ? <BookmarkOff /> : <Bookmark />}
            </IconButton>
        </Tooltip>
    )
}

export default RecipeBookmarkButton
