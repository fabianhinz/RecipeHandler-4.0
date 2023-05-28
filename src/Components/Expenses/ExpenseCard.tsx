import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  Theme,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Archive, Edit } from '@mui/icons-material'
import { addDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import { useGridContext } from '@/Components/Provider/GridProvider'
import { resolveCollection, resolveDoc } from '@/firebase/firebaseQueries'
import { Expense, User } from '@/model/model'
import useCurrentExpenseStore from '@/store/CurrentExpenseStore'
import useExpenseStore from '@/store/ExpenseStore'

import expenseUtils from './helper/expenseUtils'

const archiveExpense = async (expense: Expense, userId: User['uid']) => {
  await addDoc(resolveCollection(`users/${userId}/archivedExpenses`), {
    ...expense,
    deletedAt: Timestamp.fromDate(new Date()),
  })
  await deleteDoc(resolveDoc(`users/${userId}/expenses`, expense.id))
}

interface Props {
  expense: Expense
}

const useStyles = makeStyles<Theme, { showDetails: boolean }>(theme => ({
  actionArea: props => ({
    borderBottomRightRadius: props.showDetails ? 0 : theme.shape.borderRadius,
    borderBottomLeftRadius: props.showDetails ? 0 : theme.shape.borderRadius,
  }),
}))

const ExpenseCard = (props: Props) => {
  const [showDetails, setShowDetails] = useState(false)
  const setIsDialogOpen = useExpenseStore(store => store.setIsDialogOpen)
  const setCurrentExpense = useCurrentExpenseStore(
    store => store.setCurrentExpense
  )
  const authContext = useFirebaseAuthContext()
  const gridContext = useGridContext()
  const categoryPalette = expenseUtils.useExpenseCategoryPalette({
    category: props.expense.category,
    variant: 'card',
  })

  const classes = useStyles({ showDetails })

  const handleUpdateClick = () => {
    setIsDialogOpen(true)
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
              <Grid item>{categoryPalette.icon}</Grid>
              <Grid item>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  {props.expense.description}, {props.expense.shop}
                </Typography>
                <Typography variant="caption">
                  {expenseUtils.getFormattedDateString(
                    props.expense.date.toDate()
                  )}
                  , {props.expense.category}
                </Typography>
              </Grid>
              <Grid item>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">
                  {props.expense.creator}
                </Typography>

                <Typography variant="caption">
                  {expenseUtils.formatAmount(props.expense.amount)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>

        <Collapse mountOnEnter unmountOnExit in={showDetails}>
          <CardContent>
            <Grid container spacing={1} justifyContent="flex-end">
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
                  startIcon={<Archive />}
                  onClick={() =>
                    archiveExpense(props.expense, authContext.user!.uid)
                  }>
                  archivieren
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
