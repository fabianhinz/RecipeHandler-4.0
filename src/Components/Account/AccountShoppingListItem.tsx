import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd'

import { ShoppingListItem } from '@/model/model'

const useStyles = makeStyles<Theme, { muted: boolean }>(theme => ({
  checked: {
    textDecoration: 'line-through',
  },
  listItem: {
    opacity: props => (props.muted ? 0.3 : 1),
    height: props => (props.muted ? theme.spacing(5) : theme.spacing(9)),
    transition: theme.transitions.create(['box-shadow', 'opacity', 'height']),
  },
}))

interface Props {
  item: ShoppingListItem
  index: number
  tagFilter: string | undefined
  onCheckboxChange: (
    index: number
  ) => (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  onDelete: (index: number) => () => void
}

const AccountShoppingListItem = (props: Props) => {
  const classes = useStyles({
    muted: props.tagFilter !== undefined && props.tagFilter !== props.item.tag,
  })
  const theme = useTheme()

  const getItemStyle = useCallback(
    (isDragging: boolean, draggableStyle?: DraggingStyle | NotDraggingStyle) => ({
      ...draggableStyle,
      ...(isDragging &&
        ({
          background: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4],
        } as React.CSSProperties)),
    }),
    [theme.palette.background.default, theme.shadows, theme.shape.borderRadius]
  )

  return (
    <Draggable draggableId={`${props.index}-${props.item.value}`} index={props.index}>
      {(provided, snapshot) => (
        <ListItem
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.listItem}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
          <ListItemIcon>
            <Checkbox
              checked={props.item.checked}
              onChange={props.onCheckboxChange(props.index)}
              edge="start"
            />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: clsx(props.item.checked && classes.checked),
            }}
            primary={props.item.value}
            secondary={[props.item.recipeNameRef, props.item.tag].filter(Boolean).join(', ')}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={props.onDelete(props.index)}>
              <Clear />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </Draggable>
  )
}

export default AccountShoppingListItem
