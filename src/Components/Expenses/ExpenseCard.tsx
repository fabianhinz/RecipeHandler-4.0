import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Collapse,
    Divider,
    Grid,
    IconButton,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core'
import { Edit, ExpandMore } from '@material-ui/icons'
import Commute from '@material-ui/icons/Commute'
import Fastfood from '@material-ui/icons/Fastfood'
import Weekend from '@material-ui/icons/Weekend'
import { CashMultiple, Delete } from 'mdi-material-ui'
import { useState } from 'react'

import { Expense } from '../../model/model'
import useCurrentExpenseStore, { CurrentExpenseStore } from '../../store/CurrentExpenseStore'
import useExpenseStore, { ExpenseStore } from '../../store/ExpenseStore'
import { stopPropagationProps } from '../../util/constants'
import { useBreakpointsContext } from '../Provider/BreakpointsProvider'
import { useFirebaseAuthContext } from '../Provider/FirebaseAuthProvider'
import { useGridContext } from '../Provider/GridProvider'

interface Props {
    expense: Expense
}

const getIcon = (category: string) => {
    switch (category) {
        case 'Lebensmittel':
            return <Fastfood fontSize="large" />
        case 'Mobilität':
            return <Commute fontSize="large" />
        case 'Inventar':
            return <Weekend fontSize="large" />
        case 'Sonstiges':
            return <CashMultiple fontSize="large" />
        default:
            return <Fastfood fontSize="large" />
    }
}

const dispatchSelector = (state: ExpenseStore) => ({
    openDialog: state.openNewExpenseDialog,
    deleteExpense: state.deleteExpense,
})

const dispatchCurrentExpense = (state: CurrentExpenseStore) => ({
    setCurrentExpense: state.setCurrentExpense,
})

const ExpenseCard = (props: Props) => {
    const [showDetails, setShowDetails] = useState(false)
    const { openDialog, deleteExpense } = useExpenseStore(dispatchSelector)
    const { setCurrentExpense } = useCurrentExpenseStore(dispatchCurrentExpense)
    const authContext = useFirebaseAuthContext()
    const gridContext = useGridContext()

    const handleUpdateClick = () => {
        openDialog(true)
        setCurrentExpense(props.expense)
    }

    return (
        <Grid item {...gridContext.gridBreakpointProps}>
            <Card>
                <CardActionArea disableRipple onClick={() => setShowDetails(prev => !prev)}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item>{getIcon(props.expense.category)}</Grid>
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

                        <Collapse mountOnEnter unmountOnExit in={showDetails}>
                            <Grid
                                {...stopPropagationProps}
                                container
                                spacing={1}
                                justify="flex-end">
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
                                            deleteExpense(
                                                props.expense.id ?? '',
                                                authContext.user?.uid ?? ''
                                            )
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
                        </Collapse>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default ExpenseCard
