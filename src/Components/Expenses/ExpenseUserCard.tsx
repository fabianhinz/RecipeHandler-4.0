import { Card, Grid, Grow, makeStyles, Theme, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { useLayoutEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

import useDebounce from '../../hooks/useDebounce'
import { Nullable } from '../../model/model'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { ExpenseFiter } from './Expenses'
import { CATEGORIES_PALETTE } from './helper/expenseUtils'

const selector = (state: ExpenseStore) => state.expenses

interface StyleProps {
    userData: UserData
    activePieCell: Nullable<ActivePieCell>
    focused: boolean
    activeFilter: boolean
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
    card: {
        padding: theme.spacing(2),
        minWidth: 150,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        position: 'relative',
        transition: theme.transitions.create('border-color'),
        borderWidth: theme.spacing(0.5),
        borderColor: props => {
            if (props.activeFilter) return theme.palette.secondary.main
            return props.focused ? '#ffffff1f' : 'transparent'
        },
        cursor: 'pointer',
    },
    activePieCell: {
        position: 'absolute',
        width: 70,
        left: theme.spacing(2),
        color: props =>
            props.activePieCell ? CATEGORIES_PALETTE[props.activePieCell.category] : 'inherhit',
    },
    activePieCellCategory: {
        top: theme.spacing(0.5),
    },
    activePieCellValue: {
        bottom: theme.spacing(0.5),
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

type ActivePieCell = {
    category: string
    value: number
}

interface Props {
    filter: Nullable<ExpenseFiter>
    onFilterChange: (filter: Nullable<ExpenseFiter>) => void
    userName: string
}

const ExpenseUserCard = (props: Props) => {
    const [focused, setFocused] = useState(false)
    const expenses = useExpenseStore(selector)
    const categories = useExpenseStore(store => store.categories)
    const [activePieCell, setActivePieCell] = useState<Nullable<ActivePieCell>>(null)
    const [userData, setUserData] = useState<UserData>({
        name: '',
        amount: 0,
        amountByCategory: new Map(),
        difference: 0,
    })
    const classes = useStyles({
        userData,
        activePieCell,
        focused,
        activeFilter: props.filter?.key === 'creator' && props.filter.value === props.userName,
    })

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
    const amountByCategoryEntries = useMemo(
        () => [...debouncedAmountByCategory.entries()],
        [debouncedAmountByCategory]
    )

    const handleFocusChange = (direction: 'enter' | 'leave' | 'filter') => () => {
        if (direction === 'enter' || direction === 'leave') {
            setFocused(direction === 'enter' ? true : false)
        } else {
            props.onFilterChange(
                props.filter?.value === props.userName
                    ? null
                    : { key: 'creator', value: props.userName }
            )
        }
    }

    return (
        <Grid item>
            <Card
                onClick={handleFocusChange('filter')}
                onMouseEnter={handleFocusChange('enter')}
                onMouseLeave={handleFocusChange('leave')}
                className={classes.card}>
                <Grow key={activePieCell?.category} in={activePieCell !== null}>
                    <Typography
                        className={clsx(classes.activePieCell, classes.activePieCellCategory)}
                        align="center"
                        variant="caption">
                        {activePieCell?.category}
                    </Typography>
                </Grow>
                <Grow key={activePieCell?.value} in={activePieCell !== null}>
                    <Typography
                        className={clsx(classes.activePieCell, classes.activePieCellValue)}
                        align="center"
                        variant="caption">
                        {activePieCell?.value.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </Typography>
                </Grow>
                <PieChart margin={CHART_MARGIN} width={70} height={70}>
                    <Pie
                        onMouseEnter={(_, index) => {
                            const [category, payload] = amountByCategoryEntries[index]
                            setActivePieCell({
                                category,
                                value: payload.value,
                            })
                        }}
                        onMouseLeave={() => setActivePieCell(null)}
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
