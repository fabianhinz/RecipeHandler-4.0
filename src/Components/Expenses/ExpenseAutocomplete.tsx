import { TextField } from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import React from 'react'

interface Props {
    label: string
    value?: string
    options: string[]
    onValueChange: (value: string) => void
}

const filter = createFilterOptions<string>()

const ExpenseAutocomplete = (props: Props) => (
    <Autocomplete
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        fullWidth
        value={props.value}
        onChange={(_, newValue: string | null) => {
            props.onValueChange(newValue ?? '')
        }}
        filterOptions={(options, filterState) => {
            const filtered = filter(options, filterState)

            if (filtered.length === 0 && filterState.inputValue.length > 0) {
                filtered.push(filterState.inputValue)
            }

            return filtered
        }}
        options={props.options}
        renderInput={params => (
            <TextField margin="normal" {...params} label={props.label} variant="outlined" />
        )}
    />
)

export default ExpenseAutocomplete
