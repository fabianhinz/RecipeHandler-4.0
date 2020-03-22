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
import React, { useEffect, useState } from 'react'

import { AmountType } from '../../../model/model'
import { RecipeCreateDispatch } from './RecipeCreateReducer'

interface Props extends Pick<RecipeCreateDispatch, 'dispatch'> {
    amount: number
}

const useStyles = makeStyles(theme =>
    // TODO Aussehen auf Mobile überprüfen
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

const RecipeCreateChangeAmount = ({ amount, dispatch }: Props) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    // TODO set to real value at beginning e.g. cakeForm if it is over 20
    const [typeOfAmount, setTypeOfAmount] = useState<AmountType>('persons')
    const [displayedText, setDisplayedText] = useState<string>('1 Person')
    const handleAmountChange = (amount: number) => {
        dispatch({ type: 'setAmount', amount: amount })
    }
    const handleAmountTypeChange = (amountType: AmountType) => {
        setTypeOfAmount(amountType)
        if (amountType === 'cakeForm') dispatch({ type: 'setAmount', amount: 21 })
        else if (amountType === 'muffins') dispatch({ type: 'setAmount', amount: 36 })
        else dispatch({ type: 'setAmount', amount: 1 })
    }
    // TODO auslagern?
    useEffect(() => {
        switch (amount) {
            case 21: {
                setDisplayedText('eine kleine Form')
                break
            }
            case 22: {
                setDisplayedText('eine große Form')
                break
            }
            case 23: {
                setDisplayedText('ein Blech')
                break
            }
            case 1: {
                setDisplayedText('1 Person')
                break
            }
            default: {
                if (amount > 30) setDisplayedText(`${amount - 30} Stück`)
                else setDisplayedText(`${amount} Personen`)
                break
            }
        }
    }, [amount])

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="text" className={classes.headerButton}>
                <Typography variant="h5">Zutaten für {displayedText}</Typography>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Mengenangabe definieren</DialogTitle>
                <DialogContent>
                    <form className={classes.formContainer}>
                        <FormControl className={classes.formControl}>
                            <Select
                                id="amount-type"
                                value={typeOfAmount}
                                onChange={event =>
                                    handleAmountTypeChange(event.target.value as AmountType)
                                }
                                input={<Input />}>
                                <MenuItem value="persons">Personen</MenuItem>
                                <MenuItem value="cakeForm">Kuchenform</MenuItem>
                                <MenuItem value="muffins">Muffins</MenuItem>
                            </Select>
                        </FormControl>
                        {typeOfAmount === 'cakeForm' && (
                            <FormControl className={classes.formControl}>
                                <Select
                                    id="amount-value"
                                    value={amount}
                                    onChange={event =>
                                        handleAmountChange(event.target.value as number)
                                    }
                                    input={<Input />}>
                                    <MenuItem value={21}>kleine Form</MenuItem>
                                    <MenuItem value={22}>große Form</MenuItem>
                                    <MenuItem value={23}>Blech</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        {typeOfAmount === 'persons' && (
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
                                        <Typography variant="h5">{amount}</Typography>
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
                        {typeOfAmount === 'muffins' && (
                            <FormControl className={classes.formControl}>
                                <Select
                                    id="amount-value"
                                    value={amount}
                                    onChange={event =>
                                        handleAmountChange(event.target.value as number)
                                    }
                                    input={<Input />}>
                                    <MenuItem value={36}>6 Stück</MenuItem>
                                    <MenuItem value={42}>12 Stück</MenuItem>
                                    <MenuItem value={48}>18 Stück</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </form>
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
