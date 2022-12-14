import {
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'
import { DeleteSweep } from '@material-ui/icons'
import { setDoc } from 'firebase/firestore'
import React, { useMemo, useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'

import { useSafeShoppingListRef } from '../../hooks/useSafeShoppingListRef'

const useStyles = makeStyles(theme => ({
  textFieldHelperRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
}))

const AccountShoppingListInput = (props: {
  tagFilter: string | undefined
  onTagFilterChange: (newFilter: string | undefined) => void
}) => {
  const { shoppingList } = useFirebaseAuthContext()
  const shoppingListRef = useSafeShoppingListRef()
  const [textFieldValue, setTextFieldValue] = useState('')
  const classes = useStyles()
  const theme = useTheme()

  const handleDeleteAll = async () => {
    await setDoc(shoppingListRef, {
      list: [],
    })
  }

  const memoizedTags = useMemo(() => {
    const getIsTagDone = (tag: string) =>
      shoppingList.filter(item => item.tag === tag).every(item => item.checked)

    const uniqueTags = new Set(
      shoppingList.map(item => item.tag).filter(Boolean)
    )
    return Array.from(uniqueTags).map(tag => ({
      value: tag,
      isDone: getIsTagDone(tag),
    }))
  }, [shoppingList])

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!textFieldValue.trim()) return

    let tag = ''
    let value = textFieldValue
    const regexRes = /[ ]*#(\w|ä|Ä|ö|Ö|ü|Ü){1,}[ ]*/.exec(textFieldValue)

    if (regexRes) {
      const [rawTag] = regexRes
      value = textFieldValue.replace(rawTag, ' ').trim()
      tag = rawTag.trim().replace('#', '')
    } else if (props.tagFilter !== undefined) {
      tag = props.tagFilter
    }

    const list = [
      {
        checked: false,
        value,
        tag,
      },
      ...shoppingList,
    ]

    setTextFieldValue('')
    await setDoc(shoppingListRef, { list })
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <TextField
        value={textFieldValue}
        FormHelperTextProps={{
          classes: { root: classes.textFieldHelperRoot },
        }}
        helperText={
          <>
            {memoizedTags.map(tag => (
              <Typography
                key={tag.value}
                onClick={() =>
                  props.onTagFilterChange(
                    props.tagFilter === tag.value ? undefined : tag.value
                  )
                }
                style={{
                  cursor: 'pointer',
                  textDecoration: tag.isDone
                    ? 'line-through'
                    : tag.value === props.tagFilter
                    ? 'underline'
                    : 'none',
                  color:
                    tag.value === props.tagFilter
                      ? theme.palette.secondary.main
                      : 'inherit',
                }}
                variant="caption">
                #{tag.value}
              </Typography>
            ))}
          </>
        }
        onChange={e => setTextFieldValue(e.target.value)}
        variant="outlined"
        fullWidth
        label="Liste ergänzen"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleDeleteAll} size="small">
                <DeleteSweep />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  )
}

export default AccountShoppingListInput
