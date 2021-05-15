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
    TextField,
} from '@material-ui/core'
import { Save } from '@material-ui/icons'
import CloseIcon from '@material-ui/icons/Close'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React from 'react'

import { FirebaseService } from '../../services/firebase'
import useCurrentExpenseState, { CurrentExpenseState } from '../../store/CurrentExpenseState'
import useExpenseStore, { ExpenseState } from '../../store/ExpenseState'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { SlideUp } from '../Shared/Transitions'
import ExpenseAutocomplete from './ExpenseAutocomplete'

interface Props {
    open: boolean
    onClose: () => void
}

const selector = (state: ExpenseState) => ({
    autocompleteOptions: state.autocompleteOptions,
    categories: state.categories,
})

const currentExpenseSelector = (state: CurrentExpenseState) => ({
    id: state.id,
    amount: state.amount,
    creator: state.creator,
    shop: state.shop,
    category: state.category,
    description: state.description,
    date: state.date,
    relatedUsers: state.relatedUsers,
})

const dispatchCurrentExpenseSelector = (state: CurrentExpenseState) => ({
    setCreator: state.setCreator,
    setAmount: state.setAmount,
    setShop: state.setShop,
    setCategory: state.setCategory,
    setDescription: state.setDescription,
    setDate: state.setDate,
    setRelatedUsers: state.setRelatedUsers,
    clearState: state.clearState,
})

const dispatchSelector = (state: ExpenseState) => ({
    addExpense: state.addExpense,
    updateExpense: state.updateExpense,
})

const NewExpenseDialog = (props: Props) => {
    const { autocompleteOptions, categories } = useExpenseStore(selector)
    const { addExpense, updateExpense } = useExpenseStore(dispatchSelector)
    const {
        id,
        amount,
        category,
        creator,
        date,
        description,
        relatedUsers,
        shop,
    } = useCurrentExpenseState(currentExpenseSelector)
    const {
        setRelatedUsers,
        setAmount,
        setCategory,
        setCreator,
        setDate,
        setDescription,
        setShop,
        clearState,
    } = useCurrentExpenseState(dispatchCurrentExpenseSelector)
    const authContext = useFirebaseAuthContext()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!authContext.user) return
        // TODO wo überall Defaultwerte?
        if (id === undefined)
            addExpense(
                {
                    amount,
                    category,
                    creator,
                    date: date ?? FirebaseService.createTimestampFromDate(new Date()),
                    shop,
                    description: description ?? 'Einkauf',
                    relatedUsers,
                },
                authContext.user.uid
            )
        else {
            updateExpense(
                {
                    id,
                    amount,
                    category,
                    creator,
                    date: date ?? FirebaseService.createTimestampFromDate(new Date()),
                    shop,
                    description: description ?? 'Einkauf',
                    relatedUsers,
                },
                authContext.user.uid
            )
        }

        handleDialogClose()
    }

    const handleDialogClose = () => {
        props.onClose()
        clearState()
    }
    console.log(creator)
    return (
        <Dialog
            open={props.open}
            onClose={handleDialogClose}
            TransitionComponent={SlideUp}
            fullWidth
            maxWidth="md">
            <DialogTitle>{id ? 'Ausgabe bearbeiten' : 'Neue Ausgabe hinzufügen'}</DialogTitle>
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item md={6} xs={12}>
                            <ExpenseAutocomplete
                                label="Ersteller"
                                value={creator}
                                onValueChange={setCreator}
                                options={autocompleteOptions.creator}
                            />
                            <TextField
                                type="number"
                                inputProps={{ min: 0 }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                }}
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Betrag"
                            />
                            <ExpenseAutocomplete
                                label="Geschäft"
                                value={shop}
                                options={autocompleteOptions.shop}
                                onValueChange={setShop}
                            />
                            <ExpenseAutocomplete
                                label="Kategorie"
                                value={category}
                                options={categories}
                                onValueChange={setCategory}
                            />
                            <ExpenseAutocomplete
                                label="Beschreibung"
                                value={description}
                                options={autocompleteOptions.description}
                                onValueChange={setDescription}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Grid container spacing={2} alignItems="center" direction="column">
                                <Grid item>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            disableToolbar
                                            variant="static"
                                            format="dd.MM.yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Einkaufsdatum"
                                            value={FirebaseService.createDateFromTimestamp(date)}
                                            onChange={date =>
                                                setDate(
                                                    FirebaseService.createTimestampFromDate(
                                                        date ?? new Date()
                                                    )
                                                )
                                            }
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={1}>
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
                    <Button color="secondary" startIcon={<Save />} type="submit">
                        speichern
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default NewExpenseDialog
