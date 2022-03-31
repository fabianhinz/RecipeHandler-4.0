import { makeStyles, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { Expense, Nullable } from '../../model/model'
import useExpenseStore from '../../store/ExpenseStore'
import { ExpenseFilter, ExpenseFilterChangeHandler } from './Expenses'
import expenseUtils, { CATEGORIES_PALETTE } from './helper/expenseUtils'

const useTooltipStyles = makeStyles<Theme>(theme => ({
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
    const classes = useTooltipStyles()
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

const useChartStyles = makeStyles<Theme, { fixed: boolean }>(theme => ({
    chartWrapper: props => ({
        position: props.fixed ? 'fixed' : 'static',
        top: props.fixed ? '84px' : '0px',
    }),
}))

interface Props {
    expensesByMonth: [string, Expense[]][]
    maxAmount: number
    filter: ExpenseFilter
    onFilterChange: ExpenseFilterChangeHandler
}

export const ExpensesChart = (props: Props) => {
    const categories = useExpenseStore(store => store.categories)
    const theme = useTheme()
    const xlUp = useMediaQuery(theme.breakpoints.up('xl'))
    const [fixed, setFixed] = useState(false)
    const placeholderRef = useRef<Nullable<HTMLDivElement>>(null)
    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setFixed(false),
        onLeave: () => {
            if (window.scrollY > 100) {
                setFixed(true)
            }
        },
        options: { rootMargin: `-88px 0px 0px 0px` },
    })
    const classes = useChartStyles({ fixed })

    const currentCategoryHasAmount = useCallback(
        (category: string) => {
            return (
                Object.keys(props.filter).length === 0 ||
                props.filter.category === category ||
                'category' in props.filter === false
            )
        },
        [props.filter]
    )

    const data = useMemo(() => {
        const data: { month: string; [key: string]: number | string }[] = []

        for (const [month, expenses] of props.expensesByMonth) {
            let categoriesAmount: { [key: string]: number | string } = {}
            for (const category of categories) {
                const amount = expenseUtils.getAmountByCategory(category, expenses)
                if (currentCategoryHasAmount(category)) {
                    categoriesAmount[category] = amount
                } else {
                    categoriesAmount[category] = 0
                }
            }
            data.push({ month, ...categoriesAmount })
        }

        return data.reverse()
    }, [categories, currentCategoryHasAmount, props.expensesByMonth])

    const handleAreaClick = (payload: any) => {
        props.onFilterChange('category', payload.id)
    }

    return (
        <>
            <IntersectionObserverTrigger />
            <div
                style={{ width: '100%' }}
                ref={el => {
                    if (el) {
                        placeholderRef.current = el
                    }
                }}
            />
            <div className={classes.chartWrapper}>
                <ResponsiveContainer
                    width={placeholderRef.current?.clientWidth ?? '100%'}
                    aspect={xlUp ? 3 : 2}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="9" vertical={false} opacity={0.2} />
                        <YAxis hide domain={['auto', props.maxAmount]} />
                        <XAxis hide dataKey="month" />

                        <Tooltip
                            cursor={false}
                            content={props => <CustomTooltip {...(props as CustomTooltipProps)} />}
                        />
                        {categories.map(category => (
                            <Area
                                onClick={handleAreaClick}
                                style={{
                                    cursor: 'pointer',
                                }}
                                type="monotone"
                                id={category}
                                stackId="1"
                                key={category}
                                strokeWidth={currentCategoryHasAmount(category) ? 2 : 0}
                                dataKey={category}
                                activeDot={{ r: 8 }}
                                stroke={CATEGORIES_PALETTE[category]}
                                fill={CATEGORIES_PALETTE[category]}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}
