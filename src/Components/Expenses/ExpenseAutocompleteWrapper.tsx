import { Expense } from '@/model/model'
import useExpenseStore from '@/store/ExpenseStore'

import ExpenseAutocomplete from './ExpenseAutocomplete'

interface Props extends Pick<Expense, 'shop' | 'category' | 'description'> {
  onShopChange: (shop: Expense['shop']) => void
  onCategoryChange: (shop: Expense['category']) => void
  onDescriptionChange: (shop: Expense['description']) => void
}

export const ExpenseAutocompleteWrapper = (props: Props) => {
  const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
  const categories = useExpenseStore(store => store.categories)

  return (
    <>
      <ExpenseAutocomplete
        label="Geschäft"
        value={props.shop}
        options={autocompleteOptions.shop}
        onValueChange={props.onShopChange}
      />
      <ExpenseAutocomplete
        disableFreeSolo
        label="Kategorie"
        value={props.category}
        options={categories}
        onValueChange={props.onCategoryChange}
      />
      <ExpenseAutocomplete
        label="Beschreibung"
        value={props.description}
        options={autocompleteOptions.description}
        onValueChange={props.onDescriptionChange}
      />
    </>
  )
}
