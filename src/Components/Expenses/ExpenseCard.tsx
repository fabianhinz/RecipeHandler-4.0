import { Avatar, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core'
import Commute from '@material-ui/icons/Commute'
import Fastfood from '@material-ui/icons/Fastfood'
import Weekend from '@material-ui/icons/Weekend'
import { CashMultiple } from 'mdi-material-ui'
import React from 'react'

import { Expense } from './Expenses'

interface Props {
    expense: Expense
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

const ExpenseCard = (props: Props) => {
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
                                        {props.expense.subCategory}, {props.expense.shop}
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
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default ExpenseCard
