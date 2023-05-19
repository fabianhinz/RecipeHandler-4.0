import {
  Checkbox,
  Fade,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import clsx from 'clsx'
import { setDoc } from 'firebase/firestore'
import React, { useCallback, useState } from 'react'
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { ShoppingListItem } from '@/model/model'

const useStyles = makeStyles<Theme, { muted: boolean }>(theme => ({
  checked: {
    textDecoration: 'line-through',
  },
  textFieldHelperRoot: {
    color: theme.palette.text.secondary,
    ...theme.typography.body2,
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
  const muted =
    props.tagFilter !== undefined && props.tagFilter !== props.item.tag
  const classes = useStyles({
    muted,
  })
  const theme = useTheme()
  const [isEditMode, setIsEditMode] = useState(false)
  const [editValue, setEditValue] = useState('')

  const { shoppingList, shoppingListRef } = useFirebaseAuthContext()

  const getItemStyle = useCallback(
    (
      isDragging: boolean,
      draggableStyle?: DraggingStyle | NotDraggingStyle
    ) => ({
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

  const handleEnterEditMode = () => {
    if (muted) {
      return
    }

    setIsEditMode(true)
    setEditValue(props.item.value)
  }

  const handleExitEditMode = async () => {
    if (
      shoppingList[props.index].value === editValue ||
      editValue.length === 0
    ) {
      setIsEditMode(false)
      return
    }

    shoppingList[props.index].value = editValue
    if (shoppingListRef.current) {
      await setDoc(shoppingListRef.current, { list: shoppingList })
    }
    setIsEditMode(false)
  }

  const secondaryText = [props.item.recipeNameRef, props.item.tag]
    .filter(Boolean)
    .join(', ')

  return (
    <Draggable
      draggableId={`${props.index}-${props.item.value}`}
      index={props.index}>
      {(provided, snapshot) => (
        <ListItem
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.listItem}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}>
          <ListItemIcon>
            <Checkbox
              checked={props.item.checked}
              disabled={muted}
              onChange={props.onCheckboxChange(props.index)}
              edge="start"
            />
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <>
                {isEditMode ? (
                  <TextField
                    autoFocus
                    helperText={secondaryText}
                    FormHelperTextProps={{
                      classes: { root: classes.textFieldHelperRoot },
                    }}
                    fullWidth
                    value={editValue}
                    onBlur={handleExitEditMode}
                    onChange={e => setEditValue(e.target.value)}
                  />
                ) : (
                  <>
                    <Typography
                      noWrap={muted}
                      className={clsx(props.item.checked && classes.checked)}
                      style={{ cursor: muted ? 'inherit' : 'text' }}
                      onClick={handleEnterEditMode}>
                      {props.item.value}
                    </Typography>
                    <Fade in={!muted}>
                      <Typography variant="body2" color="textSecondary">
                        {secondaryText}
                      </Typography>
                    </Fade>
                  </>
                )}
              </>
            }
          />
          {/* do not use the ListItemSecondaryAction. This will mess up styles on dragging */}
          <ListItemIcon>
            <IconButton onClick={props.onDelete(props.index)}>
              <Clear />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      )}
    </Draggable>
  )
}

export default AccountShoppingListItem
