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
import { Autocomplete } from '@material-ui/lab'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, { useState } from 'react'

import { FirebaseService } from '../../services/firebase'
import { SlideUp } from '../Shared/Transitions'
import useExpenseStore, { ExpenseState } from '../State/ExpenseState'

interface Props {
    open: boolean
    onClose: () => void
}

const selector = (state: ExpenseState) => ({
    users: state.user,
    categories: state.categories,
})

const dispatchSelector = (state: ExpenseState) => state.addExpense

const NewExpenseDialog = (props: Props) => {
    const { users, categories } = useExpenseStore(selector)
    const addExpense = useExpenseStore(dispatchSelector)

    const [creator, setCreator] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)
    const [shop, setShop] = useState<string>('')
    const [category, setCategory] = useState<string>('Lebensmittel')
    const [description, setDescription] = useState<string>('Einkauf')
    const [date, setDate] = useState<Date | null>(new Date())
    const [relatedUsers, setRelatedUsers] = useState<string[]>([...users])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // TODO wo überall Defaultwerte?
        addExpense({
            amount,
            category,
            creator,
            date: FirebaseService.createTimestampFromDate(date ?? new Date()),
            shop,
            description: description ?? 'Einkauf',
            relatedUsers,
        })
        handleDialogClose()
    }

    const clearState = () => {
        setCreator('')
        setAmount(0.0)
        setShop('')
        setCategory('Lebensmittel')
        setDescription('Einkauf')
        setDate(new Date())
        setRelatedUsers([...users])
    }

    const handleAffectedUserChipClicked = (user: string) => {
        if (relatedUsers.includes(user)) {
            if (relatedUsers.length === 1) return setRelatedUsers([...users])
            return setRelatedUsers(relUsers => relUsers.filter(u => u !== user))
        }
        setRelatedUsers(relUsers => [user, ...relUsers])
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
            maxWidth="md">
            <DialogTitle>Neue Ausgabe hinzufügen</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <Autocomplete
                                id="creator-select"
                                autoComplete
                                autoSelect
                                getOptionLabel={option => option}
                                value={creator}
                                onChange={(_, newValue: string | null) => {
                                    setCreator(newValue ?? '')
                                }}
                                fullWidth
                                options={users}
                                renderInput={params => (
                                    <TextField
                                        autoComplete="creator"
                                        margin="normal"
                                        {...params}
                                        label="Ersteller"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <TextField
                                autoFocus
                                autoComplete="amount"
                                type="number"
                                inputProps={{ min: 0, step: 0.5 }}
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
                            <TextField
                                autoFocus
                                autoComplete="store"
                                value={shop}
                                onChange={e => setShop(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Geschäft"
                            />
                            <Autocomplete
                                id="category-Select"
                                autoComplete
                                autoSelect
                                fullWidth
                                options={categories}
                                value={category}
                                onChange={(_, newValue: string | null) => {
                                    setCategory(newValue ?? '')
                                }}
                                renderInput={params => (
                                    <TextField
                                        autoComplete="category"
                                        margin="normal"
                                        {...params}
                                        label="Kategorie"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <TextField
                                autoFocus
                                autoComplete="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Beschreibung"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={2} justify="center">
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
                                            value={date}
                                            onChange={date => setDate(date)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={1}>
                                        {users.map(user => (
                                            <Grid item key={user}>
                                                <Chip
                                                    color={
                                                        relatedUsers.includes(user)
                                                            ? 'secondary'
                                                            : 'default'
                                                    }
                                                    label={user}
                                                    onClick={() =>
                                                        handleAffectedUserChipClicked(user)
                                                    }
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
                        anlegen
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default NewExpenseDialog
