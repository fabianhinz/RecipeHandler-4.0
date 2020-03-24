import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    Input,
    makeStyles,
    MenuItem,
    Select,
    Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddCircle'
import CloseIcon from '@material-ui/icons/Close'
import RemoveIcon from '@material-ui/icons/RemoveCircle'
import React, { useState } from 'react'

import { Quantity, QuantityType } from '../../../model/model'
import { displayedQuantity } from '../../../util/constants'
import { RecipeCreateDispatch } from './RecipeCreateReducer'

interface Props extends Pick<RecipeCreateDispatch, 'dispatch'> {
    amount?: number
    quantity: Quantity
}

const useStyles = makeStyles(theme =>
    createStyles({
        headerButton: {
            textTransform: 'none',
        },
        formContainer: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 200,
        },
        amountContainer: {
            justifyContent: 'center',
        },
    })
)

const RecipeCreateChangeAmount = ({ amount, quantity, dispatch }: Props) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const handleAmountChange = (
        event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
    ) => {
        dispatch({
            type: 'quantityChange',
            quantity: { ...quantity, value: event.target.value as number },
        })
    }
    const handleQuantityTypeChange = (
        event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
    ) => {
        dispatch({
            type: 'quantityChange',
            quantity: {
                type: event.target.value as QuantityType,
                value: event.target.value === 'muffins' ? 6 : 1,
            },
        })
    }

    useState(() => {
        if (!quantity && amount) {
            dispatch({
                type: 'quantityChange',
                quantity: { type: 'persons', value: amount },
            })
        }
    })

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="text" className={classes.headerButton}>
                <Typography variant="h5">Zutaten für {displayedQuantity(quantity)}</Typography>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Mengenangabe definieren</DialogTitle>
                <DialogContent className={classes.formContainer}>
                    <FormControl className={classes.formControl}>
                        <Select
                            id="amount-type"
                            value={quantity.type}
                            onChange={handleQuantityTypeChange}
                            input={<Input />}>
                            <MenuItem value="persons">Personen</MenuItem>
                            <MenuItem value="cakeForm">Kuchenform</MenuItem>
                            <MenuItem value="muffins">Muffins</MenuItem>
                        </Select>
                    </FormControl>
                    {quantity.type === 'cakeForm' && (
                        <FormControl className={classes.formControl}>
                            <Select
                                id="amount-value"
                                value={quantity.value}
                                onChange={handleAmountChange}
                                input={<Input />}>
                                <MenuItem value={1}>kleine Form</MenuItem>
                                <MenuItem value={2}>große Form</MenuItem>
                                <MenuItem value={3}>Blech</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    {quantity.type === 'persons' && (
                        <FormControl className={classes.formControl}>
                            <Grid
                                container
                                wrap="nowrap"
                                spacing={1}
                                alignItems="center"
                                className={classes.amountContainer}>
                                <Grid item>
                                    <IconButton
                                        onClick={() => dispatch({ type: 'decreaseAmount' })}
                                        size="small">
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5">{quantity.value}</Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={() => dispatch({ type: 'increaseAmount' })}
                                        size="small">
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </FormControl>
                    )}
                    {quantity.type === 'muffins' && (
                        <FormControl className={classes.formControl}>
                            <Select
                                id="amount-value"
                                value={quantity.value}
                                onChange={handleAmountChange}
                                input={<Input />}>
                                <MenuItem value={6}>6 Stück</MenuItem>
                                <MenuItem value={12}>12 Stück</MenuItem>
                                <MenuItem value={18}>18 Stück</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default RecipeCreateChangeAmount
