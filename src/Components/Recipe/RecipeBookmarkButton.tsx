import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  TooltipProps,
} from '@material-ui/core/'
import { Bookmark, BookmarkOff } from 'mdi-material-ui'
import React from 'react'

import { useBookmarkContext } from '../Provider/BookmarkProvider'

export interface RecipeButtonSharedProps {
  variant?: 'IconButton' | 'ListItem'
}

interface Props extends RecipeButtonSharedProps {
  name: string
  tooltipProps?: Pick<TooltipProps, 'placement'>
}

const RecipeBookmarkButton = (props: Props) => {
  const { bookmarks, handleBookmarkChange } = useBookmarkContext()

  const icon = bookmarks.has(props.name) ? <BookmarkOff /> : <Bookmark />
  const title = bookmarks.has(props.name)
    ? 'Von den Lesezeichen entfernen'
    : 'Zu Lesezeichen hinzufügen'
  const onClick = () => handleBookmarkChange(props.name)

  if (props.variant === 'ListItem') {
    return (
      <ListItem onClick={onClick} button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    )
  }

  return (
    <Tooltip {...props.tooltipProps} title={title}>
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Tooltip>
  )
}

export default RecipeBookmarkButton
