import {
    Box,
    Button,
    Collapse,
    Divider,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core'
import { Cancel } from '@material-ui/icons'
import { ChevronRight } from 'mdi-material-ui'
import { useMemo, useState } from 'react'

import { Expense } from '@/model/model'
import useExpenseStore from '@/store/ExpenseStore'

import ExpenseCard from './ExpenseCard'
import ExpenseCategoryChip from './ExpenseCategoryChip'
import { ExpenseFilter, ExpenseFilterChangeHandler } from './Expenses'

interface StyleProps {
    expanded: boolean
}

const useStyles = makeStyles<Theme, StyleProps>(theme => ({
    expandBtn: {
        fontSize: theme.typography.subtitle1.fontSize,
    },
    chevron: {
        transition: theme.transitions.create('transform'),
        transform: props => `rotate(${props.expanded ? 90 : 0}deg)`,
    },
    chipContainer: {
        overflowX: 'auto',
    },
}))

interface Props {
    month: string
    expenses: Expense[]
    filter: ExpenseFilter
    onFilterChange: ExpenseFilterChangeHandler
}

const ExpensesByMonth = (props: Props) => {
    const [expanded, setExpanded] = useState<StyleProps['expanded']>(false)
    const classes = useStyles({ expanded })

    const categories = useExpenseStore(store => store.categories)

    const filterAwareCategories = useMemo(() => {
        if ('category' in props.filter === false) {
            return categories
        }

        return categories.filter(category => category === props.filter.category)
    }, [categories, props.filter])

    const filterAwareExpenses = useMemo(() => {
        if ('category' in props.filter === false) {
            return props.expenses
        }
        return props.expenses.filter(expense => expense.category === props.filter.category)
    }, [props.expenses, props.filter])

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Button
                    startIcon={<ChevronRight className={classes.chevron} />}
                    className={classes.expandBtn}
                    variant="text"
                    onClick={() => setExpanded(value => !value)}>
                    {props.month}
                </Button>

                <Typography>
                    Summe:{' '}
                    {props.expenses
                        .map(e => e.amount)
                        .reduce((prev, curr) => prev + curr, 0)
                        .toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                </Typography>
            </Box>
            <Divider variant="middle" />
            <Collapse mountOnEnter unmountOnExit in={expanded}>
                <Grid container spacing={2}>
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        <Grid container wrap="nowrap" className={classes.chipContainer} spacing={1}>
                            {filterAwareCategories.map(category => (
                                <ExpenseCategoryChip
                                    onClick={() => {
                                        props.onFilterChange('category', category)
                                    }}
                                    icon={
                                        props.filter.category === category ? <Cancel /> : undefined
                                    }
                                    disabled={Boolean(
                                        props.filter.category && props.filter.category !== category
                                    )}
                                    key={category}
                                    category={category}
                                    expenses={props.expenses}
                                />
                            ))}
                        </Grid>
                    </Grid>
                    {filterAwareExpenses.map((e, i) => (
                        <ExpenseCard key={i} expense={e} />
                    ))}
                    <Grid item xs={12} />
                </Grid>
            </Collapse>
        </>
    )
}

export default ExpensesByMonth
