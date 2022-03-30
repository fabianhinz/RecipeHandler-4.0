import Splitter from '@devbookhq/splitter'
import { Box, Grid, makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { TableChart, Timeline, VerticalSplit } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'

import useDocumentTitle from '../../hooks/useDocumentTitle'
import { Expense } from '../../model/model'
import useCurrentExpenseStore from '../../store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { BORDER_RADIUS } from '../../theme'
import { SecouredRouteFab } from '../Routes/SecouredRouteFab'
import EntryGridContainer from '../Shared/EntryGridContainer'
import NotFound from '../Shared/NotFound'
import ArchivedExpensesSelection from './ArchivedExpensesSelection'
import ExpenseDialog from './ExpenseDialog'
import ExpensesByMonth from './ExpensesByMonth'
import { ExpensesChart } from './ExpensesChart'
import ExpenseUserCard from './ExpenseUserCard'
import expenseUtils from './helper/expenseUtils'
const selector = (state: ExpenseStore) => ({
    expenses: state.expenses,
    isDialogOpen: state.isNewExpenseDialogOpen,
})

const dispatchSelector = (state: ExpenseStore) => ({
    openDialog: state.openNewExpenseDialog,
})

const useStyles = makeStyles(theme => ({
    container: {
        overflowX: 'auto',
    },
    splitDragger: {
        backgroundColor: theme.palette.text.secondary,
    },
    splitGutter: {
        background: theme.palette.divider,
        borderRadius: BORDER_RADIUS,
        margin: theme.spacing(1),
    },
}))

export type ExpenseFilter = Partial<Pick<Expense, 'creator' | 'category'>>
export type ExpenseFilterChangeHandler = <Key extends keyof ExpenseFilter>(
    key: Key,
    value: ExpenseFilter[Key]
) => void

export type ViewVariant = 'table' | 'graph' | 'split'

/**
 * # ToDo:
 * - [ ] Add a year filter for all expenses >> [2021, 2022, all]
 * - [x] filter between views should be propagated to each other
 * - [x] split view on desktop? https://www.npmjs.com/package/@devbookhq/splitter
 * - [ ] extenseable filter with autocomplete options
 */
const Expenses = () => {
    const [filter, setFilter] = useState<ExpenseFilter>({})
    const theme = useTheme()
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
    const [view, setView] = useState<ViewVariant>('table')
    const [splitterSizes, setSplitterSizes] = useState([40, 60])

    useLayoutEffect(() => {
        setView(lgUp ? 'split' : 'table')
    }, [lgUp])

    const classes = useStyles()

    const { expenses, isDialogOpen } = useExpenseStore(selector)
    const { openDialog } = useExpenseStore(dispatchSelector)
    const expensesByMonth = useExpenseStore(store => store.expensesByMonth)
    const expenseStoreLoading = useExpenseStore(store => store.loading)
    const autocompleteOptions = useExpenseStore(store => store.autocompleteOptions)
    const resetCurrentExpense = useCurrentExpenseStore(store => store.clearState)

    useDocumentTitle('Ausgaben')

    const expensesToRenderMemoized = useMemo(() => {
        if (!filter) {
            return Array.from(expensesByMonth.entries())
        }
        return expenseUtils.getFilteredExpensesByMonth(expensesByMonth, filter)
    }, [expensesByMonth, filter])

    const handleFilterChange: ExpenseFilterChangeHandler = useCallback(
        (key, value) => {
            const nextFilter = { ...filter }

            if (nextFilter[key] === value) {
                delete nextFilter[key]
            } else {
                nextFilter[key] = value
            }

            setFilter(nextFilter)
        },
        [filter]
    )

    const memoizedTable = useMemo(() => {
        // check for length to avoid jumpy chart animation
        return (
            expensesToRenderMemoized.length > 0 &&
            expensesToRenderMemoized.map(([month, expenses]) => (
                <ExpensesByMonth
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    key={month}
                    expenses={expenses}
                    month={month}
                />
            ))
        )
    }, [expensesToRenderMemoized, filter, handleFilterChange])

    const memoizedGraph = useMemo(() => {
        return (
            <ExpensesChart
                filter={filter}
                onFilterChange={handleFilterChange}
                expensesByMonth={expensesToRenderMemoized}
            />
        )
    }, [expensesToRenderMemoized, filter, handleFilterChange])

    return (
        <EntryGridContainer>
            {autocompleteOptions.creator.length > 0 && (
                <Grid item xs={12}>
                    <Grid container wrap="nowrap" className={classes.container} spacing={3}>
                        {autocompleteOptions.creator.map(u => (
                            <ExpenseUserCard
                                filter={filter}
                                onFilterChange={handleFilterChange}
                                key={u}
                                userName={u}
                            />
                        ))}
                    </Grid>
                </Grid>
            )}

            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Typography variant="h4">Ausgaben</Typography>
                        <Box ml={1}>
                            <ToggleButtonGroup
                                size="small"
                                value={view}
                                exclusive
                                onChange={(_, newAlignment) => {
                                    if (newAlignment) {
                                        setView(newAlignment)
                                    }
                                }}
                                aria-label="text alignment">
                                <ToggleButton value="table">
                                    <TableChart />
                                </ToggleButton>
                                <ToggleButton value="graph">
                                    <Timeline />
                                </ToggleButton>
                                <ToggleButton disabled={!lgUp} value="split">
                                    <VerticalSplit />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>

                    <Box flexGrow={0}>
                        <ArchivedExpensesSelection />
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12}>
                {view === 'table' && memoizedTable}

                {view === 'graph' && memoizedGraph}

                {view === 'split' && (
                    <Splitter
                        initialSizes={splitterSizes}
                        minWidths={[400, 400]}
                        onResizeFinished={(_, newSizes) => setSplitterSizes(newSizes)}
                        draggerClassName={classes.splitDragger}
                        gutterClassName={classes.splitGutter}>
                        <div>{memoizedTable}</div>
                        <div>{memoizedGraph}</div>
                    </Splitter>
                )}
            </Grid>

            <NotFound visible={!expenseStoreLoading && expenses.length === 0} />

            <SecouredRouteFab
                onClick={() => {
                    resetCurrentExpense()
                    openDialog(true)
                }}
                tooltipTitle="Ausgabe hinzufügen"
                icon={<AddIcon />}
            />
            <ExpenseDialog open={isDialogOpen} onClose={() => openDialog(false)} />
        </EntryGridContainer>
    )
}

export default Expenses
