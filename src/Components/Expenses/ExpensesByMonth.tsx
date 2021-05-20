import { Box, Button, Collapse, Grid, Typography } from '@material-ui/core'
import { useState } from 'react'

import { Expense } from '../../model/model'
import ExpenseCard from './ExpenseCard'

interface Props {
    month: string
    expenses: Expense[]
}

const ExpensesByMonth = (props: Props) => {
    const [expanded, setExpanded] = useState(false)
    return (
        <>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Button variant="text">
                        <Typography
                            style={{ cursor: 'pointer' }}
                            onClick={() => setExpanded(value => !value)}
                            variant="subtitle1">
                            {props.month}
                        </Typography>
                    </Button>

                    <Box flexGrow={0}>
                        <Typography variant="subtitle1">
                            Summe:{' '}
                            {props.expenses
                                .map(e => e.amount)
                                .reduce((prev, curr) => prev + curr)
                                .toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} style={{ padding: 0 }}>
                <Collapse in={expanded}>
                    <Grid container spacing={3} style={{ margin: 0 }}>
                        {props.expenses.map((e, i) => (
                            <ExpenseCard key={i} expense={e} />
                        ))}
                    </Grid>
                </Collapse>
            </Grid>
        </>
    )
}

export default ExpensesByMonth
