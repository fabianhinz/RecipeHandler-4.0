import { IconButton, InputAdornment, TextField } from '@material-ui/core'
import { DeleteSweep } from '@material-ui/icons'
import { useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'

const AccountShoppingListInput = () => {
    const { shoppingList, shoppingListRef } = useFirebaseAuthContext()
    const [textFieldValue, setTextFieldValue] = useState('')

    const handleDeleteAll = () => {
        shoppingListRef.current?.set({ list: [] })
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!textFieldValue.trim()) return

        const list = [
            {
                checked: false,
                value: textFieldValue,
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
