import { Divider, makeStyles, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { Expense } from '../../model/model'
import useExpenseStore from '../../store/ExpenseStore'
import { ExpenseFilter, ExpenseFilterChangeHandler } from './Expenses'
import expenseUtils, { CATEGORIES_PALETTE } from './helper/expenseUtils'

const useStyles = makeStyles<Theme>(theme => ({
    tooltipPaper: {
        padding: theme.spacing(1),
    },
    tooltipChips: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        flexWrap: 'wrap',
    },
    tooltipLabel: {
        ...theme.typography.button,
        textTransform: 'none',
        fontFamily: 'Ubuntu',
        fontSize: theme.typography.subtitle1.fontSize,
        minWidth: 200,
    },
}))

interface CustomTooltipProps {
    active: boolean
    label: string
    payload: { dataKey: string; value: number; id: string }[]
}

const CustomTooltip = (props: CustomTooltipProps) => {
    const classes = useStyles()
    const sumOfMonth = useMemo(() => {
        if (Array.isArray(props.payload)) {
            const sum = props.payload.reduce((acc, { value }) => acc + value, 0)
            return expenseUtils.expenseFormatter.format(sum)
        }
    }, [props.payload])

    if (props.active && props.payload && props.payload.length) {
        return (
            <Typography className={classes.tooltipLabel}>
                {props.label} <br /> {sumOfMonth}
            </Typography>
        )
    }

    return null
}

interface Props {
    expensesByMonth: [string, Expense[]][]
    filter: ExpenseFilter
    onFilterChange: ExpenseFilterChangeHandler
}

export const ExpensesChart = (props: Props) => {
    const categories = useExpenseStore(store => store.categories)
    const theme = useTheme()
    const xlUp = useMediaQuery(theme.breakpoints.up('xl'))

    const data = useMemo(() => {
        const data: { month: string; [key: string]: number | string }[] = []
        const filteredByActiveArea = categories.filter(category =>
            'category' in props.filter ? props.filter.category === category : true
        )

        for (const [month, expenses] of props.expensesByMonth) {
            let categoriesAmount: { [key: string]: number | string } = {}
            for (const category of filteredByActiveArea) {
                const amount = expenseUtils.getAmountByCategory(category, expenses)
                categoriesAmount[category] = amount
            }
            data.push({ month, ...categoriesAmount })
        }

        return data.reverse()
    }, [categories, props.expensesByMonth, props.filter])

    const handleAreaClick = (payload: any) => {
        props.onFilterChange('category', payload.id)
    }

    return (
        <>
            <Divider variant="middle" />
            <ResponsiveContainer width="100%" aspect={xlUp ? 3 : 2}>
                <AreaChart data={data}>
                    <XAxis hide dataKey="month" />

                    <Tooltip
                        cursor={false}
                        content={props => <CustomTooltip {...(props as CustomTooltipProps)} />}
                    />
                    {categories.map(category => (
                        <Area
                            onClick={handleAreaClick}
                            style={{ cursor: 'pointer' }}
                            type="monotone"
                            id={category}
                            stackId="1"
                            key={category}
                            strokeWidth={2}
                            dataKey={category}
                            activeDot={{ r: 8 }}
                            stroke={CATEGORIES_PALETTE[category]}
                            fill={CATEGORIES_PALETTE[category]}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
            <Divider variant="middle" />
        </>
    )
}
