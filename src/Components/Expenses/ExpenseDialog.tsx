import DateFnsUtils from '@date-io/date-fns'
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core'
import { Save } from '@material-ui/icons'
import CloseIcon from '@material-ui/icons/Close'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import deLocale from 'date-fns/locale/de'
import { addDoc, Timestamp, updateDoc } from 'firebase/firestore'

import { useBreakpointsContext } from '@/Components/Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { SlideUp } from '@/Components/Shared/Transitions'
import { resolveCollection, resolveDoc } from '@/firebase/firebaseQueries'
import { Expense } from '@/model/model'
import useCurrentExpenseStore, {
  CurrentExpenseStore,
} from '@/store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '@/store/ExpenseStore'

import ExpenseAutocomplete from './ExpenseAutocomplete'
import { ExpenseAutocompleteWrapper } from './ExpenseAutocompleteWrapper'

interface Props {
  open: boolean
  onClose: () => void
}

const selector = (state: ExpenseStore) => ({
  autocompleteOptions: state.autocompleteOptions,
  categories: state.categories,
})

const currentExpenseSelector = (state: CurrentExpenseStore) => ({
  id: state.id,
  amount: state.amount,
  creator: state.creator,
  shop: state.shop,
  category: state.category,
  description: state.description,
  date: state.date,
  relatedUsers: state.relatedUsers,
})

const dispatchCurrentExpenseSelector = (state: CurrentExpenseStore) => ({
  setCreator: state.setCreator,
  setAmount: state.setAmount,
  setShop: state.setShop,
  setCategory: state.setCategory,
  setDescription: state.setDescription,
  setDate: state.setDate,
  setRelatedUsers: state.setRelatedUsers,
  clearState: state.clearState,
})

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowY: 'auto',
  },
})

const ExpenseDialog = (props: Props) => {
  const { autocompleteOptions } = useExpenseStore(selector)
  const {
    id,
    amount,
    category,
    creator,
    date,
    description,
    relatedUsers,
    shop,
  } = useCurrentExpenseStore(currentExpenseSelector)
  const {
    setRelatedUsers,
    setAmount,
    setCategory,
    setCreator,
    setDate,
    setDescription,
    setShop,
    clearState,
  } = useCurrentExpenseStore(dispatchCurrentExpenseSelector)
  const setAutocompleteOptions = useExpenseStore(
    store => store.setAutocompleteOptions
  )
  const authContext = useFirebaseAuthContext()
  const breakpointsContext = useBreakpointsContext()
  const classes = useStyles()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authContext.user) {
      return
    }

    if (id === undefined) {
      const data: Expense = {
        amount,
        category,
        creator,
        date: date ?? Timestamp.fromDate(new Date()),
        shop,
        description: description ?? 'Einkauf',
        relatedUsers,
      }

      await addDoc(
        resolveCollection(`users/${authContext.user.uid}/expenses`),
        data
      )
    } else {
      const data: Expense = {
        id,
        amount,
        category,
        creator,
        date: date ?? Timestamp.fromDate(new Date()),
        shop,
        description: description ?? 'Einkauf',
        relatedUsers,
      }

      await updateDoc(
        resolveDoc(`users/${authContext.user.uid}/expenses`, id),
        data
      )
    }

    handleDialogClose()
  }

  const handleDialogClose = () => {
    props.onClose()
    clearState()
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleDialogClose}
      TransitionComponent={SlideUp}
      fullWidth
      fullScreen={breakpointsContext.isDialogFullscreen}
      maxWidth="md">
      <DialogTitle>
        {id ? 'Ausgabe bearbeiten' : 'Neue Ausgabe hinzufügen'}
      </DialogTitle>
      <form className={classes.form} onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item md={6} xs={12}>
              <ExpenseAutocomplete
                label="Ersteller"
                value={creator}
                onValueChange={creator => {
                  setCreator(creator)
                  if (!autocompleteOptions.creator.includes(creator)) {
                    setAutocompleteOptions({
                      ...autocompleteOptions,
                      creator: [...autocompleteOptions.creator, creator].sort(),
                    })
                    setRelatedUsers(creator)
                  }
                }}
                options={autocompleteOptions.creator}
              />
              <TextField
                type="number"
                inputProps={{ min: 0 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                }}
                defaultValue={amount}
                onChange={e => {
                  const newAmount = Number(e.target.value)
                  if (!isNaN(newAmount)) {
                    setAmount(newAmount)
                  }
                }}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Betrag"
              />

              <ExpenseAutocompleteWrapper
                shop={shop}
                category={category}
                description={description}
                onCategoryChange={setCategory}
                onShopChange={newShop => {
                  setShop(newShop)
                  if (!autocompleteOptions.shop.includes(newShop)) {
                    setAutocompleteOptions({
                      ...autocompleteOptions,
                      shop: [...autocompleteOptions.shop, newShop],
                    })
                  }
                }}
                onDescriptionChange={newDescription => {
                  setDescription(newDescription)
                  if (
                    !autocompleteOptions.description.includes(newDescription)
                  ) {
                    setAutocompleteOptions({
                      ...autocompleteOptions,
                      description: [
                        ...autocompleteOptions.description,
                        newDescription,
                      ],
                    })
                  }
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                direction="column">
                <Grid item>
                  <MuiPickersUtilsProvider
                    locale={deLocale}
                    utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      fullWidth
                      disableFuture
                      disableToolbar
                      variant="static"
                      format="dd.MM.yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Einkaufsdatum"
                      value={date.toDate()}
                      onChange={date => {
                        const newDate = date ?? new Date()
                        setDate(Timestamp.fromDate(newDate))
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                  <Grid container wrap="nowrap" spacing={1}>
                    {autocompleteOptions.creator.map(user => (
                      <Grid item key={user}>
                        <Chip
                          color={
                            relatedUsers.includes(user)
                              ? 'secondary'
                              : 'default'
                          }
                          label={user}
                          onClick={() => setRelatedUsers(user)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<CloseIcon />} onClick={props.onClose}>
            abbrechen
          </Button>
          <Button
            color="secondary"
            disabled={!category || !creator || !amount || !description || !shop}
            startIcon={<Save />}
            type="submit">
            speichern
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ExpenseDialog
