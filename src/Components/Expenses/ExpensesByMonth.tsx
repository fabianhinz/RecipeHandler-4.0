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
import { ChevronRight } from 'mdi-material-ui'
import { useState } from 'react'

import { Expense } from '../../model/model'
import ExpenseCard from './ExpenseCard'

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
}))

interface Props {
    month: string
    expenses: Expense[]
}

const ExpensesByMonth = (props: Props) => {
    const [expanded, setExpanded] = useState<StyleProps['expanded']>(false)
    const classes = useStyles({ expanded })

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
                        .reduce((prev, curr) => prev + curr)
                        .toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                </Typography>
            </Box>
            <Divider variant="middle" />
            <Collapse in={expanded}>
                <Grid container spacing={2}>
                    <Grid item xs={12} />
                    {props.expenses.map((e, i) => (
                        <ExpenseCard key={i} expense={e} />
                    ))}
                    <Grid item xs={12} />
                </Grid>
            </Collapse>
        </>
    )
}

export default ExpensesByMonth
