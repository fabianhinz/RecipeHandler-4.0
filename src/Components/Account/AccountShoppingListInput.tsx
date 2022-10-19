import {
    IconButton,
    InputAdornment,
    makeStyles,
    TextField,
    Typography,
    useTheme,
} from '@material-ui/core'
import { DeleteSweep } from '@material-ui/icons'
import React, { useMemo, useState } from 'react'

import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'

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
    const { shoppingList, shoppingListRef } = useFirebaseAuthContext()
    const [textFieldValue, setTextFieldValue] = useState('')
    const classes = useStyles()
    const theme = useTheme()

    const handleDeleteAll = () => {
        shoppingListRef.current?.set({ list: [] })
    }

    const memoizedTags = useMemo(() => {
        const uniqueTags = new Set(shoppingList.map(item => item.tag).filter(Boolean) as string[])
        return Array.from(uniqueTags)
    }, [shoppingList])

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!textFieldValue.trim()) return

        let tag: string = ''
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
        shoppingListRef.current?.set({ list })
        setTextFieldValue('')
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
                                onClick={() =>
                                    props.onTagFilterChange(
                                        props.tagFilter === tag ? undefined : tag
                                    )
                                }
                                style={{
                                    cursor: 'pointer',
                                    textDecoration: tag === props.tagFilter ? 'underline' : 'none',
                                    color:
                                        tag === props.tagFilter
                                            ? theme.palette.secondary.main
                                            : 'inherit',
                                }}
                                variant="caption"
                                key={tag}>
                                #{tag}
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
