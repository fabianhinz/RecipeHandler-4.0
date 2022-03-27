import { Box, makeStyles, Theme, Typography, useTheme } from '@material-ui/core'
import { useMemo, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { Expense, Nullable } from '../../model/model'
import useExpenseStore from '../../store/ExpenseStore'
import ExpenseCategoryChip from './ExpenseCategoryChip'
import expenseUtils, { CATEGORIES_PALETTE } from './helper/expenseUtils'

interface Props {
    expensesByMonth: [string, Expense[]][]
}

const useStyles = makeStyles<Theme, { width: number }>(theme => ({
    tooltipPaper: {
        padding: theme.spacing(1),
        width: props => props.width,
    },
    tooltipChips: {
        display: 'flex',
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
    payload: { dataKey: string; value: number }[]
    containerRef: Nullable<HTMLDivElement>
}

const CustomTooltip = (props: CustomTooltipProps) => {
    const classes = useStyles({ width: props.containerRef?.clientWidth ?? 0 })

    if (props.active && props.payload && props.payload.length) {
        return (
            <div className={classes.tooltipdiv}>
                <Typography gutterBottom className={classes.tooltipLabel}>
                    {props.label}
                </Typography>
                <div className={classes.tooltipChips}>
                    {props.payload.map((p, index: number) => (
                        <ExpenseCategoryChip
                            key={index}
                            category={p.dataKey}
                            expenses={expenseUtils.numberFormatter.format(p.value)}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return null
}

export const ExpensesChart = (props: Props) => {
    const [containerRef, setContainerRef] = useState<Nullable<HTMLDivElement>>(null)
    const categories = useExpenseStore(store => store.categories)
    const theme = useTheme()
    const focusedColor = theme.palette.type === 'dark' ? '#ffffff1f' : '#0000001f'

    const data = useMemo(() => {
        const data: { month: string; [key: string]: number | string }[] = []

        for (const [month, expenses] of props.expensesByMonth) {
            let categoriesAmount: { [key: string]: number | string } = {}
            for (const category of categories) {
                const amount = expenseUtils.getAmountByCategory(category, expenses)
                categoriesAmount[category] = amount
            }
            data.push({ month, ...categoriesAmount })
        }

        return data.reverse()
    }, [categories, props.expensesByMonth])

    return (
        <>
            <div
                style={{ border: `2px solid ${focusedColor}`, borderRadius: 4 }}
                ref={el => {
                    if (el) setContainerRef(el)
                }}>
                <ResponsiveContainer width="100%" height={500}>
                    <AreaChart style={{ marginTop: 50 }} data={data}>
                        <XAxis hide dataKey="month" />
                        <Tooltip
                            position={{ y: -50, x: 4 }}
                            isAnimationActive={false}
                            // cursor={{ stroke: focusedColor, strokeWidth: 2 }}
                            cursor={false}
                            content={props => (
                                <CustomTooltip
                                    {...(props as CustomTooltipProps)}
                                    containerRef={containerRef}
                                />
                            )}
                        />
                        {categories.map(category => (
                            <Area
                                type="monotone"
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
            </div>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle2" color="textSecondary">
                    {data[0]?.month}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    {data[data.length - 1]?.month}
                </Typography>
            </Box>
        </>
    )
}
