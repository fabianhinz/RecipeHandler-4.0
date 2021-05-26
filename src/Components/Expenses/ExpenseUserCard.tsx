import { Card, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import { useLayoutEffect, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

import useDebounce from '../../hooks/useDebounce'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { CATEGORIES_PALETTE } from './helper/expenseUtils'

interface Props {
    userName: string
}

const selector = (state: ExpenseStore) => state.expenses

const useStyles = makeStyles<Theme, { userData: UserData }>(theme => ({
    card: {
        padding: theme.spacing(2),
        minWidth: 150,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
    },
    differenceTypography: {
        ...theme.typography.h6,
        color: props =>
            props.userData.difference < 0 ? theme.palette.error.main : theme.palette.success.main,
    },
    amountTypography: {
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
    },
}))

const CHART_MARGIN = { top: 0, right: 0, bottom: 0, left: 0 }

type UserData = {
    name: string
    amount: number
    difference: number
    amountByCategory: Map<string, { value: number }>
}

const ExpenseUserCard = (props: Props) => {
    const expenses = useExpenseStore(selector)
    const categories = useExpenseStore(store => store.categories)
    const [userData, setUserData] = useState<UserData>({
        name: '',
        amount: 0,
        amountByCategory: new Map(),
        difference: 0,
    })
    const classes = useStyles({ userData })

    useLayoutEffect(() => {
        const userExpenses = expenses.filter(expense => expense.creator === props.userName)

        const payed = userExpenses
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
            amountByCategory: new Map(
                categories.map(category => [
                    category,
                    {
                        value: userExpenses
                            .filter(expense => expense.category === category)
                            .reduce((acc, curr) => (acc += curr.amount), 0),
                    },
                ])
            ),
            difference: payed - shouldPay,
        })
    }, [expenses, props.userName, categories])

    const debouncedAmountByCategory = useDebounce(userData.amountByCategory, 50)

    return (
        <Grid item>
            <Card className={classes.card}>
                <PieChart margin={CHART_MARGIN} width={70} height={70}>
                    <Pie
                        innerRadius={10}
                        dataKey="value"
                        data={[...debouncedAmountByCategory.values()]}>
                        {[...debouncedAmountByCategory.keys()].map(category => (
                            <Cell key={category} fill={CATEGORIES_PALETTE[category]} />
                        ))}
                    </Pie>
                </PieChart>

                <div>
                    <Typography variant="h6">{userData.name}</Typography>
                    <Typography className={classes.amountTypography}>
                        {userData.amount.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </Typography>
                </div>

                <Typography className={classes.differenceTypography}>
                    {userData.difference.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                    })}
                </Typography>
            </Card>
        </Grid>
    )
}

export default ExpenseUserCard
