import { Avatar, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core'
import React, { useLayoutEffect, useState } from 'react'

import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'

interface Props {
    userName: string
}

const selector = (state: ExpenseStore) => state.expenses

const useStyles = makeStyles(theme => ({
    card: {
        padding: theme.spacing(2),
        width: 250,
    },
    userAvatar: {
        height: 50,
        width: 50,
        border: `4px solid ${theme.palette.divider}`,
    },
    userContainer: {
        marginBottom: theme.spacing(1),
    },
}))

const ExpenseUserCard = (props: Props) => {
    const expenses = useExpenseStore(selector)
    const [userData, setUserData] = useState<{ name: string; amount: number; difference: number }>({
        name: '',
        amount: 0,
        difference: 0,
    })
    const classes = useStyles()

    useLayoutEffect(() => {
        const payed = expenses
            .filter(expense => expense.creator === props.userName)
            .map(expense => expense.amount)
            .reduce((prev, curr) => prev + curr, 0)

        const shouldPay = expenses
            .filter(expense => expense.relatedUsers?.includes(props.userName))
            .map(
                expense =>
                    expense.amount /
                    (expense.relatedUsers.length > 0 ? expense.relatedUsers.length : 1)
            )
            .reduce((prev, curr) => prev + curr, 0)

        setUserData({
            name: props.userName,
            amount: payed,
            difference: payed - shouldPay,
        })
    }, [expenses, props.userName])

    return (
        <Grid item>
            <Card variant="outlined" className={classes.card}>
                <Grid className={classes.userContainer} container alignItems="center" spacing={1}>
                    <Grid item>
                        <Avatar className={classes.userAvatar}>{userData.name.slice(0, 1)}</Avatar>
                    </Grid>

                    <Grid item>
                        <Typography align="center" variant="h6">
                            {userData.name}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justify="space-between">
                    <Grid item xs={6}>
                        <Typography variant="body2">Kontostand</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            variant="body2"
                            color={userData.difference < 0 ? 'error' : 'inherit'}>
                            {userData.difference.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2">Ausgaben</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="body2">
                            {userData.amount.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default ExpenseUserCard
