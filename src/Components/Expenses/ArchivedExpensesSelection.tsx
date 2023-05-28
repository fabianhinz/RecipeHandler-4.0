import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'
import { Unarchive } from '@mui/icons-material'
import { addDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { Archive, Delete } from 'mdi-material-ui'
import { useEffect, useState } from 'react'

import { useFirebaseAuthContext } from '@/Components/Provider/FirebaseAuthProvider'
import SelectionDrawer from '@/Components/Shared/SelectionDrawer'
import {
  resolveArchivedExpensesOrderedByDateDesc,
  resolveCollection,
  resolveDoc,
} from '@/firebase/firebaseQueries'
import { ArchivedExpense, Expense, User } from '@/model/model'

import NotFound from '../Shared/NotFound'

const clearArchive = async (expenses: Expense[], userId: User['uid']) => {
  return Promise.all(
    expenses.map(expense => {
      return deleteDoc(
        resolveDoc(`users/${userId}/archivedExpenses`, expense.id)
      )
    })
  )
}

const restoreExpense = async (
  { deletedAt, ...expense }: ArchivedExpense,
  userId: User['uid']
) => {
  await addDoc(resolveCollection(`users/${userId}/expenses`), expense)
  await deleteDoc(resolveDoc(`users/${userId}/archivedExpenses`, expense.id))
}

const ArchivedExpensesSelection = () => {
  const [expenses, setExpenses] = useState<ArchivedExpense[]>([])
  const authContext = useFirebaseAuthContext()

  useEffect(() => {
    if (!authContext.user) {
      return
    }

    return onSnapshot(
      resolveArchivedExpensesOrderedByDateDesc(authContext.user.uid),
      snapshot => {
        setExpenses(
          snapshot.docs.map(
            doc => ({ ...doc.data(), id: doc.id } as ArchivedExpense)
          )
        )
      }
    )
  }, [authContext.user])

  return (
    <SelectionDrawer
      buttonProps={{
        icon: <Archive />,
        label: 'Archiv',
        disabled: expenses.length === 0,
      }}
      action={
        <IconButton
          disabled={expenses.length === 0}
          onClick={() => clearArchive(expenses, authContext.user!.uid)}
          size="large">
          <Delete />
        </IconButton>
      }>
      <NotFound visible={expenses.length === 0} />

      <List disablePadding>
        {expenses.map(expense => (
          <ListItem key={expense.id}>
            <ListItemAvatar>
              <Avatar>{expense.creator.slice(0, 1)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Typography variant="subtitle2">
                  {expense.description}, {expense.shop}
                </Typography>
              }
              secondary={
                <Typography variant="caption">
                  {expense.date.toDate().toLocaleDateString()},{' '}
                  {expense.category}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => restoreExpense(expense, authContext.user!.uid)}
                size="large">
                <Unarchive />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </SelectionDrawer>
  );
}

export default ArchivedExpensesSelection
