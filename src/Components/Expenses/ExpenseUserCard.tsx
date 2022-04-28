import { Card, Grid, Grow, makeStyles, Theme, Typography, Zoom } from '@material-ui/core'
import { Cancel } from '@material-ui/icons'
import clsx from 'clsx'
import { useLayoutEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

import useDebounce from '../../hooks/useDebounce'
import { Nullable } from '../../model/model'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { stopPropagationProps } from '../../util/constants'
import { ExpenseFilter, ExpenseFilterChangeHandler } from './Expenses'
import { CATEGORIES_PALETTE } from './helper/expenseUtils'

const selector = (state: ExpenseStore) => state.expenses

interface StyleProps {
    userData: UserData
    activePieCell: Nullable<ActivePieCell>
    disabled: boolean
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
    card: {
        padding: theme.spacing(2),
        minWidth: 150,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        position: 'relative',
        transition: theme.transitions.create('opacity'),
        opacity: props => (props.disabled ? 0.3 : 1),
        cursor: props => (props.disabled ? 'unset' : 'pointer'),
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
    cancelIconContainer: {
        position: 'absolute',
        zIndex: 1,
        width: 70,
        height: 70,
        display: 'grid',
        placeItems: 'center',
    },
    cancelIcon: {
        fill: theme.palette.divider,
        width: '100%',
        height: '100%',
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
    filter: ExpenseFilter
    onFilterChange: ExpenseFilterChangeHandler
    userName: string
    year: number | undefined
}

const ExpenseUserCard = (props: Props) => {
    const expenses = useExpenseStore(selector)
    const categories = useExpenseStore(store => store.categories)
    const [activePieCell, setActivePieCell] = useState<Nullable<ActivePieCell>>(null)
    const [userData, setUserData] = useState<UserData>({
        name: '',
        amount: 0,
        amountByCategory: new Map(),
        difference: 0,
    })

    const filteredByCurrentUser = useMemo(() => {
        return 'creator' in props.filter && props.filter.creator === props.userName
    }, [props.filter, props.userName])

    const disabled = useMemo(() => {
        if (!props.filter.creator) return false

        return filteredByCurrentUser === false
    }, [filteredByCurrentUser, props.filter])

    const classes = useStyles({
        userData,
        activePieCell,
        disabled,
    })

    useLayoutEffect(() => {
        const expensesOfYear = expenses.filter(expense => {
            if (props.year === undefined) {
                return expense
            }
            return expense.date.toDate().getFullYear() === props.year
        })

        const userExpenses = expensesOfYear.filter(expense => expense.creator === props.userName)

        const payed = userExpenses
            .map(expense => expense.amount)
            .reduce((prev, curr) => prev + curr, 0)

        const shouldPay = expensesOfYear
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
    }, [expenses, props.userName, categories, props.year])

    const debouncedAmountByCategory = useDebounce(userData.amountByCategory, 50)
    const amountByCategoryEntries = useMemo(
        () => [...debouncedAmountByCategory.entries()],
        [debouncedAmountByCategory]
    )

    const handleFilterChange = () => {
        if (disabled) {
            return
        }

        props.onFilterChange('creator', props.userName)
    }

    const handlePieChartMouseEnter = (_: unknown, index: number) => {
        if (disabled) {
            return
        }

        const [category, payload] = amountByCategoryEntries[index]
        setActivePieCell({
            category,
            value: payload.value,
        })
    }

    return (
        <Grid item>
            <Card onClick={handleFilterChange} className={classes.card}>
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
                <Zoom in={filteredByCurrentUser} mountOnEnter={false} unmountOnExit>
                    <div className={classes.cancelIconContainer}>
                        <Cancel className={classes.cancelIcon} />
                    </div>
                </Zoom>

                <Zoom in={!filteredByCurrentUser}>
                    <div {...stopPropagationProps}>
                        <PieChart margin={CHART_MARGIN} width={70} height={70}>
                            <Pie
                                onMouseEnter={handlePieChartMouseEnter}
                                onMouseLeave={() => setActivePieCell(null)}
                                innerRadius={10}
                                dataKey="value"
                                data={[...debouncedAmountByCategory.values()]}>
                                {[...debouncedAmountByCategory.keys()].map(category => (
                                    <Cell key={category} fill={CATEGORIES_PALETTE[category]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </div>
                </Zoom>

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
