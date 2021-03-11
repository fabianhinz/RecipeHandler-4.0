import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import React, { useLayoutEffect, useState } from 'react'

import { Expense } from './Expenses'

interface Props {
    userName: string
    expenses: Expense[]
}

const UserCard = (props: Props) => {
    const [userData, setUserData] = useState<{ name: string; amount: number; difference: number }>({
        name: '',
        amount: 0,
        difference: 0,
    })

    useLayoutEffect(() => {
        const payed = props.expenses
            .filter(expense => expense.creator === props.userName)
            .map(expense => expense.amount)
            .reduce((prev, curr) => prev + curr, 0)

        const shouldPay = props.expenses
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
    }, [props.expenses, props.userName])

    return (
        <Grid item>
            <Card>
                <CardContent>
                    <Typography variant="h6">{userData.name}</Typography>
                    <Typography color={userData.difference < 0 ? 'error' : 'inherit'}>
                        {userData.difference.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </Typography>
                    <Typography variant="caption">
                        Bezahlt:{' '}
                        {userData.amount.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default UserCard
