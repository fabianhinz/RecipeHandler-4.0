import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { Delete } from 'mdi-material-ui'
import { useState } from 'react'

import { Expense } from '../../model/model'
import useCurrentExpenseStore, { CurrentExpenseStore } from '../../store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'
import expenseUtils from './helper/expenseUtils'

interface Props {
    expense: Expense
}

const dispatchSelector = (state: ExpenseStore) => ({
    openDialog: state.openNewExpenseDialog,
    deleteExpense: state.deleteExpense,
})

const dispatchCurrentExpense = (state: CurrentExpenseStore) => ({
    setCurrentExpense: state.setCurrentExpense,
})

const useStyles = makeStyles<Theme, { showDetails: boolean }>(theme => ({
    actionArea: props => ({
        borderBottomRightRadius: props.showDetails ? 0 : theme.shape.borderRadius,
        borderBottomLeftRadius: props.showDetails ? 0 : theme.shape.borderRadius,
    }),
}))

const ExpenseCard = (props: Props) => {
    const [showDetails, setShowDetails] = useState(false)
    const { openDialog, deleteExpense } = useExpenseStore(dispatchSelector)
    const { setCurrentExpense } = useCurrentExpenseStore(dispatchCurrentExpense)
    const authContext = useFirebaseAuthContext()
    const gridContext = useGridContext()

    const classes = useStyles({ showDetails })

    const handleUpdateClick = () => {
        openDialog(true)
        setCurrentExpense(props.expense)
    }

    return (
        <Grid item {...gridContext.gridBreakpointProps}>
            <Card>
                <CardActionArea
                    className={classes.actionArea}
                    disableRipple
                    onClick={() => setShowDetails(prev => !prev)}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item>
                                {expenseUtils.getIconByExpenseCategory(props.expense.category)}
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">
                                    {props.expense.description}, {props.expense.shop}
                                </Typography>
                                <Typography variant="caption">
                                    {props.expense.date.toDate().toLocaleDateString()},{' '}
                                    {props.expense.category}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">{props.expense.creator}</Typography>

                                <Typography variant="caption">
                                    {props.expense.amount.toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>

                <Collapse mountOnEnter unmountOnExit in={showDetails}>
                    <CardContent>
                        <Grid container spacing={1} justify="flex-end">
                            <Grid item xs={12} />
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    {props.expense.relatedUsers.map(user => (
                                        <Grid item key={user}>
                                            <Chip size="small" label={user} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <Grid item xs={6} md="auto">
                                <Button
                                    fullWidth
                                    startIcon={<Delete />}
                                    onClick={() =>
                                        deleteExpense(props.expense, authContext.user?.uid ?? '')
                                    }>
                                    löschen
                                </Button>
                            </Grid>
                            <Grid item xs={6} md="auto">
                                <Button
                                    color="secondary"
                                    fullWidth
                                    startIcon={<Edit />}
                                    onClick={handleUpdateClick}>
                                    bearbeiten
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}

export default ExpenseCard
