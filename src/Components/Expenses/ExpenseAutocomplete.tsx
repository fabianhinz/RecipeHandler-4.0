import { TextField } from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'

interface Props {
  disableFreeSolo?: boolean
  label: string
  value?: string
  clearable?: boolean
  options: string[]
  onValueChange: (value: string) => void
}

const filter = createFilterOptions<string>()

const ExpenseAutocomplete = (props: Props) => (
  <Autocomplete
    freeSolo={props.disableFreeSolo ? undefined : true}
    selectOnFocus
    clearOnBlur
    handleHomeEndKeys
    fullWidth
    value={props.value}
    onChange={(_, value: string | null) => {
      const trimmedValue = value?.trim()
      if (props.clearable) {
        props.onValueChange(trimmedValue ?? '')
      } else if (trimmedValue) {
        props.onValueChange(trimmedValue)
      }
    }}
    filterOptions={(options, filterState) => {
      const filtered = filter(options, filterState)

      if (
        !props.disableFreeSolo &&
        filtered.length === 0 &&
        filterState.inputValue.length > 0
      ) {
        filtered.push(filterState.inputValue)
      }

      return filtered
    }}
    options={props.options}
    renderInput={params => (
      <TextField
        margin="normal"
        {...params}
        label={props.label}
        variant="outlined"
      />
    )}
  />
)

export default ExpenseAutocomplete
