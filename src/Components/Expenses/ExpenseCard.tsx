import { Avatar, Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import Commute from '@material-ui/icons/Commute'
import Fastfood from '@material-ui/icons/Fastfood'
import Weekend from '@material-ui/icons/Weekend'
import { CashMultiple, Delete } from 'mdi-material-ui'
import React from 'react'

import { Expense } from '../../model/model'
import useCurrentExpenseState, { CurrentExpenseState } from '../State/CurrentExpenseState'
import useExpenseStore, { ExpenseState } from '../State/ExpenseState'

interface Props {
    expense: Expense
    id: number
}

const getIcon = (category: string) => {
    switch (category) {
        case 'Lebensmittel':
            return <Fastfood fontSize="large" />
        case 'Mobilität':
            return <Commute fontSize="large" />
        case 'Inventar':
            return <Weekend fontSize="large" />
        case 'Sonstiges':
            return <CashMultiple fontSize="large" />
        default:
            return <Fastfood fontSize="large" />
    }
}

const dispatchSelector = (state: ExpenseState) => ({
    openDialog: state.openNewExpenseDialog,
    deleteExpense: state.deleteExpense,
})

const dispatchCurrentExpense = (state: CurrentExpenseState) => ({
    setCurrentExpense: state.setCurrentExpense,
})

const ExpenseCard = (props: Props) => {
    const { openDialog, deleteExpense } = useExpenseStore(dispatchSelector)
    const { setCurrentExpense } = useCurrentExpenseState(dispatchCurrentExpense)

    const handleUpdateClick = () => {
        openDialog(true)
        setCurrentExpense({ ...props.expense, id: props.id })
    }

    return (
        <Grid item>
            <Card>
                <CardContent>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <Grid container spacing={2}>
                                <Grid item>{getIcon(props.expense.category)}</Grid>
                                <Grid item>
                                    <Typography variant="subtitle2">
                                        {props.expense.description}, {props.expense.shop}
                                    </Typography>
                                    <Typography variant="caption">
                                        {props.expense.date.toDate().toLocaleDateString()},{' '}
                                        {props.expense.category}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Typography>
                                        {props.expense.amount.toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar>{props.expense.creator.slice(0, 1)}</Avatar>
                                </Grid>

                                <Grid item onClick={handleUpdateClick}>
                                    <IconButton>
                                        <Edit />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => deleteExpense(props.id)}>
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default ExpenseCard
