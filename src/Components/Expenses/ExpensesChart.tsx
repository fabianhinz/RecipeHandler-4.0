import {
    FormControlLabel,
    makeStyles,
    Radio,
    RadioGroup,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
    },
}))

interface CustomTooltipProps {
    active: boolean
    label: string
    payload: { dataKey: string; value: number; id: string }[]
    hoveringCategory: Nullable<string>
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
                {props.label} <br /> {sumOfMonth} <br /> {props.hoveringCategory}
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
    enableFixedOnScroll: boolean
}

type GroupBy = 'month' | 'shop'

export const ExpensesChart = (props: Props) => {
    const categories = useExpenseStore(store => store.categories)
    const shops = useExpenseStore(store => store.autocompleteOptions.shop)
    const theme = useTheme()
    const xlUp = useMediaQuery(theme.breakpoints.up('xl'))
    const [fixed, setFixed] = useState(false)
    const placeholderRef = useRef<Nullable<HTMLDivElement>>(null)
    const { IntersectionObserverTrigger } = useIntersectionObserver({
        onIsIntersecting: () => setFixed(false),
        onLeave: () => props.enableFixedOnScroll && window.scrollY > 200 && setFixed(true),
        options: { rootMargin: `-88px 0px 0px 0px` },
    })
    const [groupBy, setGroupBy] = useState<GroupBy>('month')
    const [hoveringCategory, setHoveringCategory] = useState<Nullable<string>>(null)
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

    const monthData = useMemo(() => {
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

    const shopData = useMemo(() => {
        const data: Map<string, number> = new Map()
        const expenses = props.expensesByMonth.flatMap(([, expenses]) => expenses)

        for (const shop of shops) {
            const amount = expenseUtils.getAmountByShop(shop, expenses)
            if (amount === 0) {
                continue
            }
            data.set(shop, amount)
        }
        const sorted = Array.from(data.entries()).sort((a, b) => b[1] - a[1])

        return sorted.map(([shop, amount]) => ({ shop, amount }))
    }, [props.expensesByMonth, shops])

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
                <RadioGroup
                    value={groupBy}
                    onChange={(_, value) => setGroupBy(value as GroupBy)}
                    style={{
                        flexDirection: 'row',
                        width: placeholderRef.current?.clientWidth ?? '100%',
                    }}
                    name="gender1">
                    <FormControlLabel value="month" control={<Radio />} label="Monat" />
                    <FormControlLabel value="shop" control={<Radio />} label="Geschäft" />
                </RadioGroup>
                <ResponsiveContainer
                    width={placeholderRef.current?.clientWidth ?? '100%'}
                    aspect={xlUp ? 3 : 2}>
                    <BarChart data={groupBy === 'month' ? monthData : shopData}>
                        <CartesianGrid strokeDasharray="9" vertical={false} opacity={0.4} />
                        <YAxis
                            hide
                            domain={groupBy === 'month' ? ['auto', props.maxAmount] : undefined}
                        />
                        <XAxis hide dataKey={groupBy} />

                        <Tooltip
                            cursor={{ fill: theme.palette.divider, fillOpacity: 0.6 }}
                            content={props => (
                                <CustomTooltip
                                    {...(props as CustomTooltipProps)}
                                    hoveringCategory={hoveringCategory}
                                />
                            )}
                        />
                        {groupBy === 'shop' && (
                            <Bar
                                fillOpacity={0.5}
                                strokeWidth={2}
                                stroke={
                                    props.filter.category
                                        ? CATEGORIES_PALETTE[props.filter.category]
                                        : theme.palette.primary.main
                                }
                                fill={
                                    props.filter.category
                                        ? CATEGORIES_PALETTE[props.filter.category]
                                        : theme.palette.primary.main
                                }
                                dataKey="amount"
                            />
                        )}
                        {groupBy === 'month' &&
                            categories.map(category => (
                                <Bar
                                    onMouseEnter={() => setHoveringCategory(category)}
                                    onMouseLeave={() => setHoveringCategory(null)}
                                    onClick={() => props.onFilterChange('category', category)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: theme.transitions.create('fill-opacity'),
                                    }}
                                    id={category}
                                    stackId="1"
                                    key={category}
                                    dataKey={category}
                                    fillOpacity={hoveringCategory === category ? 1 : 0.5}
                                    strokeWidth={2}
                                    stroke={CATEGORIES_PALETTE[category]}
                                    fill={CATEGORIES_PALETTE[category]}
                                />
                            ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}
